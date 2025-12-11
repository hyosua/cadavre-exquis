// server/src/config/redis.ts
import Redis from 'ioredis';
// Note: dotenv est déjà chargé dans index.ts, mais cet import reste safe
import 'dotenv/config'; 

const REDIS_URL: string = process.env.REDIS_URL || 'redis://localhost:6379';
const isProduction = process.env.NODE_ENV === 'production';

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  // Configuration TLS automatique si le protocole est rediss://
  tls: REDIS_URL.startsWith('rediss://') ? {
    rejectUnauthorized: false // Souvent nécessaire pour Upstash/Heroku/Fly
  } : undefined,
  family: isProduction ? 6 : 4, // Fly.io utilise IPv6 en interne préférentiellement
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