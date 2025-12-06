// src/workers/emailWorker.js
import { Worker } from 'bullmq';
import connection from '../config/config/bullmq-connection.js';
import logger from '../utils/logger.js';
import { sendEnrollEmail, sendVerificationEmail, sendWelcomeEmail } from '../services/sendMail.js';

// NO QueueScheduler needed anymore in BullMQ v5+
// BullMQ auto-handles delayed jobs, retries, etc. when Worker starts

const worker = new Worker(
  'email',
  async (job) => {
    logger.info(`Processing job ${job.id} - ${job.name}`);

    try {
      if (job.name === 'welcome-candidate') {
        await sendWelcomeEmail(job.data);
      } else if (job.name === 'verification-mail') {
        await sendVerificationEmail(job.data);
      }
      else if (job.name === 'enroll-candidate') {
        await sendEnrollEmail(job.data)
      }
      else {
        logger.warn(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      logger.error(`Job ${job.id} failed`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on('completed', (job) => logger.info(`Job ${job.id} completed`));
worker.on('failed', (job, err) => logger.error(`Job ${job?.id} failed: ${err.message}`));

logger.info('BullMQ Email Worker started — ready for jobs!');