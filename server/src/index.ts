import dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});

import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { initializeSocket } from '@/config/socket';
import '@/config/redis';


const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// Start server
httpServer.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`
  🚀 Server started successfully!
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  📡 HTTP Server: http://0.0.0.0:${PORT}
  👉 Allowed Origins: ${allowedOrigins.join(', ')}
  `);
});