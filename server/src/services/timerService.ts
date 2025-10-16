import { Server } from 'socket.io';
import { gameService } from './gameService';

export class TimerService {
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private broadcasts: Map<string, NodeJS.Timeout> = new Map();

  startPhaseTimer(io: Server, gameId: string, duration: number): void {
    // Nettoyer les anciens timers
    this.clearTimer(gameId);

    let timeLeft = duration;

    // Broadcast du timer toutes les secondes
    const broadcastInterval = setInterval(() => {
      timeLeft--;
      io.to(gameId).emit('timer_update', { timeLeft });

      if (timeLeft <= 0) {
        clearInterval(broadcastInterval);
      }
    }, 1000);

    this.broadcasts.set(gameId, broadcastInterval);

    // Timer principal
    const timer = setTimeout(async () => {
      await this.handlePhaseTimeout(io, gameId);
      this.broadcasts.delete(gameId);
    }, duration * 1000);

    this.timers.set(gameId, timer);
  }

  private async handlePhaseTimeout(io: Server, gameId: string): Promise<void> {
    console.log(`⏰ Phase timeout for game ${gameId}`);
    
    // Remplir les mots manquants
    await gameService.fillMissingWords(gameId);
    
    // Passer à la phase suivante
    await gameService.nextPhase(io, gameId);
  }

  clearTimer(gameId: string): void {
    const timer = this.timers.get(gameId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(gameId);
    }

    const broadcast = this.broadcasts.get(gameId);
    if (broadcast) {
      clearInterval(broadcast);
      this.broadcasts.delete(gameId);
    }
  }

  clearAllTimers(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.broadcasts.forEach(broadcast => clearInterval(broadcast));
    this.timers.clear();
    this.broadcasts.clear();
  }
}

export const timerService = new TimerService();