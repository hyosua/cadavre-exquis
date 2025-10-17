import { redis } from '@/config/redis';
import { Game } from '@/types/game.types';

const GAME_TTL = 86400; // 24 heures

export class RedisService {
  // Game CRUD
  async saveGame(game: Game): Promise<void> {
    const key = `game:${game.id}`;
    await redis.setex(key, GAME_TTL, JSON.stringify(game));
    
    // Sauvegarder le mapping code -> gameId
    await redis.setex(`gamecode:${game.code}`, GAME_TTL, game.id);
  }

  async getGame(gameId: string): Promise<Game | null> {
    const key = `game:${gameId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async getGameByCode(code: string): Promise<Game | null> {
    const gameId = await redis.get(`gamecode:${code}`);
    if (!gameId) return null;
    return this.getGame(gameId);
  }

  async deleteGame(gameId: string): Promise<void> {
    const game = await this.getGame(gameId);
    if (game) {
      await redis.del(`game:${gameId}`);
      await redis.del(`gamecode:${game.code}`);
    }
  }

  // Player mapping
  async setPlayerGame(socketId: string, gameId: string): Promise<void> {
    await redis.setex(`player:${socketId}:gameId`, GAME_TTL, gameId);
  }

  async getPlayerGame(socketId: string): Promise<string | null> {
    return await redis.get(`player:${socketId}:gameId`);
  }

  async deletePlayerGame(socketId: string): Promise<void> {
    console.log("player deleted")
    await redis.del(`player:${socketId}:gameId`);
  }

  // Phase words (temporaire pour chaque phase)
  async setPhaseWord(gameId: string, phase: number, playerId: string, word: string): Promise<void> {
    const key = `game:${gameId}:phase:${phase}:words`;
    await redis.hset(key, playerId, word);
    await redis.expire(key, 3600); // 1 heure
  }

  async getPhaseWords(gameId: string, phase: number): Promise<Record<string, string>> {
    const key = `game:${gameId}:phase:${phase}:words`;
    return await redis.hgetall(key);
  }

  async deletePhaseWords(gameId: string, phase: number): Promise<void> {
    await redis.del(`game:${gameId}:phase:${phase}:words`);
  }

  // Vérifier si le code existe
  async isCodeAvailable(code: string): Promise<boolean> {
    const exists = await redis.exists(`gamecode:${code}`);
    return exists === 0;
  }
}

export const redisService = new RedisService();