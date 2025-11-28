import IORedis from 'ioredis';
import logger from '../utils/logger.js';
import config from '../config/environment.js';

const bullmqRedis = new IORedis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableOfflineQueue: false, 
});

bullmqRedis.on('error', (err) => {
  logger.error('BullMQ Redis connection error:', err.message);
});

bullmqRedis.on('connect', () => {
  logger.info('BullMQ Redis connected (ioredis)');
});

export default bullmqRedis;