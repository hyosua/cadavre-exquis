import { Server, Socket } from 'socket.io';
import { gameService } from '@/services/gameService';
import { redisService } from '@/services/redisService';

export function registerConnectionHandlers(io: Server, socket: Socket) {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('disconnect', async () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    await gameService.handleDisconnect(io, socket.id);
  });

  // handle rejoin attempts from clients
  socket.on('rejoin_game', async (data: { gameId: string; playerId: string }, ack?: (resp: any) => void) => {
    console.log('rejoin_game received', { socketId: socket.id, ...data });
    const { gameId, playerId } = data;
    try {
      const game = await redisService.getGame(gameId); 
      if (!game) {
        ack?.({ ok: false, message: 'Game not found' });
        socket.emit('rejoin_failed', { message: 'Partie introuvable' });
        return;
      }

      const player = game.players?.find((p: any) => p.id === playerId);
      if (!player) {
        ack?.({ ok: false, message: 'Player not found' });
        socket.emit('rejoin_failed', { message: 'Joueur introuvable' });
        return;
      }

      // attach socket to room and update player's socket id
      socket.join(gameId);
      player.socketId = socket.id;
      await redisService.saveGame(game); 

      ack?.({ ok: true });
      socket.emit('player_reconnected', { player, game });
      io.to(gameId).emit('game_state', game);
      console.log('player reconnected', player.id, 'to game', gameId);
    } catch (err) {
      console.error('rejoin_game error', err);
      ack?.({ ok: false, message: 'Server error' });
      socket.emit('rejoin_failed', { message: 'Erreur serveur' });
    }
  });

}