import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL!, {
  tls: {},
  family: 0,
});

redis.on('connect', () => {
  console.log('✅ Connected to Upstash!');
  redis.set('test', 'Hello Upstash!').then(() => {
    redis.get('test').then((value) => {
      console.log('Test value:', value);
      redis.quit();
    });
  });
});

redis.on('error', (err) => {
  console.error('❌ Error:', err.message);
  console.error('Full error:', err);
});