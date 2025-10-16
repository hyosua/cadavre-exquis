import { Server, Socket } from 'socket.io';
import { gameService } from '@/services/gameService';

export function registerConnectionHandlers(io: Server, socket: Socket) {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('disconnect', async () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    await gameService.handleDisconnect(io, socket.id);
  });
}