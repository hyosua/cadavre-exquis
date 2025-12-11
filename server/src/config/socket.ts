// server/src/config/socket.ts
import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { registerGameHandlers } from '@/handlers/gameHandlers';
import { registerConnectionHandlers } from '@/handlers/connectionHandlers';

export function initializeSocket(httpServer: HTTPServer): Server {
  // Récupération et nettoyage des origines
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:3000'];

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    connectionStateRecovery: {
      // Optionnel : aide à récupérer la connexion en cas de micro-coupure
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });

  io.on('connection', (socket) => {
    registerConnectionHandlers(io, socket);
    registerGameHandlers(io, socket);
  });

  return io;
}