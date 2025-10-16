import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { registerGameHandlers } from '@/handlers/gameHandlers';
import { registerConnectionHandlers } from '@/handlers/connectionHandlers';

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

export function initializeSocket(httpServer: HTTPServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    registerConnectionHandlers(io, socket);
    registerGameHandlers(io, socket);
  });

  return io;
}