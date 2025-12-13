import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (typeof window === 'undefined') return null;
    
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        autoConnect: true,
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    if (!this.socket) {
      this.connect();
    }
    return this.socket!;
  }

  emit<T = unknown>(event: string, data?: T) {
    this.getSocket().emit(event, data);
  }

  on<T = unknown>(event: string, callback: (data: T) => void) {
    this.getSocket().on(event, callback);
  }

  off<T = unknown>(event: string, callback?: (data: T) => void) {
    this.getSocket().off(event, callback);
  }
}

export const socketService = new SocketService();