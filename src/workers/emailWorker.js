import { Worker } from 'bullmq';
import logger from '../utils/logger.js';
import bullmqRedis from '../config/bullmq-redis.js';
import { sendWelcomeEmail } from '../services/sendMail.js';

const worker = new Worker(
  'email',
  async (job) => {
    switch (job.name) {
      case 'welcome-candidate':
        await sendWelcomeEmail(job.data)
        break;
      default:
        logger.warn(`Unknown job: ${job.name}`);
    }
  },
  {
    connection: bullmqRedis,   
    concurrency: 10,
  }
);

worker.on('completed', (job) => logger.info(`Job ${job.id} completed`));
worker.on('failed', (job, err) => logger.error(`Job ${job?.id} failed:`, err.message));

logger.info('Email worker started with BullMQ + ioredis');
