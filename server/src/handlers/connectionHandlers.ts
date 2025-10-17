import { Server, Socket } from 'socket.io';
import { gameService } from '@/services/gameService';
import { redisService } from '@/services/redisService';


export function registerConnectionHandlers(io: Server, socket: Socket) {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('disconnect', async () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    await gameService.handleDisconnect(io, socket.id);
  });

  socket.on('rejoin_game', async (data: { gameId: string; playerId: string }) => {
    try {
      const game = await redisService.getGame(data.gameId);
      if (!game) {
        socket.emit('error', { message: 'Partie introuvable' });
        return;
      }

      const player = game.players.find(p => p.id === data.playerId);
      if (!player) {
        socket.emit('error', { message: 'Joueur introuvable' });
        return;
      }

      // Reconnecte le joueur
      player.socketId = socket.id;
      player.isConnected = true;
      delete player.disconnectedAt;

      socket.join(game.id);
      
      socket.emit('game_state', game);
      socket.emit('current_player', player);
      
      io.to(game.id).emit('player_reconnected', { 
        playerId: player.id,
        pseudo: player.pseudo 
      });
      
      console.log(`✅ ${player.pseudo} reconnected to game ${game.id}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  });
}