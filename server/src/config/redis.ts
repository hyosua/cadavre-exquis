// server/src/config/redis.ts
import Redis from 'ioredis';
const REDIS_URL: string = process.env.REDIS_URL || 'redis://localhost:6379';
const isProduction = process.env.NODE_ENV === 'production';

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  // Configuration TLS automatique si le protocole est rediss://
  tls: REDIS_URL.startsWith('rediss://') ? {
    rejectUnauthorized: false // Souvent nécessaire pour Upstash/Heroku/Fly
  } : undefined,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

export default redis;