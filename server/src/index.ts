import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { initializeSocket } from '@/config/socket';
import '@/config/redis';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
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
httpServer.listen(PORT, () => {
  console.log(`
  🚀 Server started successfully!
  
  📡 HTTP Server: http://localhost:${PORT}
  🔌 Web
  `)
})