import { Worker } from 'bullmq';
import logger from '../utils/logger.js';
import bullmqRedis from '../config/bullmq-redis.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../services/sendMail.js';

const worker = new Worker(
  'email',
  async (job) => {
    logger.info(`Processing job ${job.id} - ${job.name}`);
    console.log('JOB DATA:', job.data); // This will now show!

    try {
      if (job.name === 'welcome-candidate') {
        await sendWelcomeEmail(job.data);
      } else if (job.name === 'verification-mail') {
        await sendVerificationEmail(job.data);
      } else {
        logger.warn(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      logger.error(`Job ${job.id} failed`, error);
      throw error; // Let BullMQ handle retry
    }
  },
  {
    connection: bullmqRedis,
    concurrency: 5,
  }
);

worker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed: ${err.message}`);
});

logger.info('Email worker started and waiting for jobs...');