'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { socketService } from '@/services/socketService';
import { useGameStore } from '@/store/gameStore';
import { toast } from 'sonner';
import { Game, Player } from '@/types/game.type';

export function useSocket() {
  const router = useRouter();
  const {
    setGame,
    setTimeLeft,
    setError,
    resetGame,
    leaveGame,
    setIsConnected,
    setCurrentPlayer,
    onGameCreated,
    updatePlayerStatus,
    currentPlayer,
    persistedGameRef,      // <— nouvelle ref
    hasHydrated,           // <— flag de réhydratation
  } = useGameStore();

  useEffect(() => {
    if (!hasHydrated) return; // évite un rejoin avant lecture du localStorage

    const socket = socketService.connect();
    if (!socket) return;

    socket.on('connect', () => {
      console.log("Attempting to connect ...")
      setIsConnected(true);
      setError(null);
      // Try to reconnect with stored credentials
      const playerId = currentPlayer?.id;
      const gameId = persistedGameRef?.id;
      if (playerId && gameId) {
        console.log('Attempting to rejoin game:', gameId, playerId);
        socket.emit('rejoin_game', { gameId, playerId });
      }
    });

    // Add specific handler for successful reconnection
    socket.on('player_reconnected', (data: { player: Player, game: Game }) => {
      console.log('Successfully reconnected to game');
      setCurrentPlayer(data.player);
      setGame(data.game);
      setError(null);
      router.push(`/game/${data.game.id}`);
      toast.success(`Connecté en tant que ${data.player.pseudo}`);
    });

    socket.on('rejoin_failed', (data: { message: string }) => {
      console.error('Rejoin failed:', data.message);
      toast.error(`${data.message}`);
      // Clear invalid stored data
      useGameStore.getState().setPersistedGameRef(null);
      setCurrentPlayer(null);
      router.push('/');
    });

    socket.on('game_created', (data: { gameId: string; code: string }) => {
      toast.success('Partie créée');
      onGameCreated?.(data.gameId);
      useGameStore.getState().setPersistedGameRef({ id: data.gameId, code: data.code });
    });

    socket.on('game_deleted', () => {
      console.log('Game deleted by server');
      resetGame()
      router.push('/');
      toast.info('Partie supprimée');
    });

    socket.on('game_left', () => {
      console.log('server-response: Player left game')
      resetGame()
      router.push('/');
    })

    socket.on('kicked_out', () => {
      console.log('Player kicked out by server')
      resetGame()
      router.push('/');
      toast.warning('Vous avez été exclu de la partie');

    })

    socket.on('game_canceled', () => {
      console.log('Game canceled by server');
      resetGame()
      router.push('/');
    });

    socket.on('assigned_host', (data: { player: Player, message: string }) => {
      console.log('server: new host assigned');
      setCurrentPlayer(data.player);
      toast.info(data.message);

    });

    socket.on('error', (data: { message: string }) => {
      setError(data.message)
      toast.error(data.message);
    });

    socket.on('join_failed', (data: { message: string }) => {
      setError(data.message)
      toast.error(data.message);
      router.push('/');
    });

    socket.on('player_status_update', (data: { playerId: string, status: 'thinking' | 'played' }) => {
      console.log(`Update player ${data.playerId}: ${data.status}`);
      updatePlayerStatus(data.playerId, data.status);
    });

    socket.on('current_player', (player) => setCurrentPlayer(player));
    socket.on('game_state', (game: Game) => {
      console.log("game_state: ",game)
      setGame(game)
    });
    socket.on('phase_started', ({ timeLeft }) => setTimeLeft(timeLeft));
    socket.on('timer_update', ({ timeLeft }) => setTimeLeft(timeLeft));

    return () => {
      [
        'connect', 'game_deleted','game_left','rejoin_game','disconnect','rejoin_failed','join_failed','player_reconnected','kicked_out','game_created','game_canceled','error',
        'current_player','game_state','phase_started','timer_update', 'assigned_host', 'player_status_update'
      ].forEach((e) => socket.off(e));
    };
  }, [hasHydrated, currentPlayer?.id, persistedGameRef?.id, onGameCreated,  setGame, setTimeLeft, setError,resetGame, leaveGame, setIsConnected, setCurrentPlayer,updatePlayerStatus, router]);

  return socketService;
}
