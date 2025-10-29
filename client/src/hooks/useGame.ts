'use client';

import { useGameStore } from '@/store/gameStore';
import { socketService } from '@/services/socketService';
import { GameConfig, Player } from '@/types/game.type';

export function useGame() {
  const { game, currentPlayer, timeLeft, error, isConnected } = useGameStore();

  const createGame = (pseudo: string, config: GameConfig) => {
    console.log("1. Création demandée")
    socketService.emit('create_game', { pseudo, config });
    console.log("socket envoyé")
  };

  const cancelGame = () => {
    if(game) {
      socketService.emit('cancel_game', { gameId: game.id });
    }
  }

  const joinGame = (code: string, pseudo: string) => {
    socketService.emit('join_game', { code, pseudo });
  };

  const leaveGame = () => {
    if (game) {
      socketService.emit('leave_game', { gameId: game.id });
    }
  };

  const startGame = () => {
    if (game) {
      socketService.emit('start_game', { gameId: game.id });
    }
  };

  const kickPlayer = (playerToRemove: Player) => {
    if (game) {
      socketService.emit('kick_player', { gameId: game.id, playerToRemove });
    }
  };

  const submitWord = (word: string) => {
    if (game) {
      socketService.emit('submit_word', { gameId: game.id, word });
    }
  };

  const vote = (sentenceId: string) => {
    if (game) {
      socketService.emit('vote', { gameId: game.id, sentenceId });
    }
  };

  const getCurrentSentence = () => {
    if (!game || !currentPlayer) return null;
    return game.sentences.find(s => s.currentPlayerId === currentPlayer.id);
  };

  const hasPlayedCurrentPhase = () => {
    if (!game || !currentPlayer) return false;
    const playerInGame = game.players.find(p => p.id === currentPlayer.id);
    return playerInGame?.hasPlayedCurrentPhase;
  };

  const hasVoted = () => {
    if (!game || !currentPlayer) return false;
    return game.votes.some(v => v.playerId === currentPlayer.id);
  };

  return {
    game,
    currentPlayer,
    timeLeft,
    error,
    isConnected,
    createGame,
    cancelGame,
    kickPlayer,
    joinGame,
    leaveGame,
    startGame,
    submitWord,
    vote,
    getCurrentSentence,
    hasPlayedCurrentPhase,
    hasVoted,
  };
}