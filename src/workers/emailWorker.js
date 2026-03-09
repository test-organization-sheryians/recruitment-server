// src/workers/emailWorker.js
import { Worker } from 'bullmq';
import connection from '../config/config/bullmq-connection.js';
import logger from '../utils/logger.js';
import { sendWelcomeEmail } from '../services/sendMailServices/sendWelcomeEmail.js';
import { sendVerificationEmail } from '../services/sendMailServices/sendVerificationEmail.js';
import { sendEnrollEmail } from '../services/sendMailServices/sendEnrollEmail.js';
import { sendScheduleInterviewEmail } from '../services/sendMailServices/sendScheduleInterviewEmail.js';
import { sendScheduleInterviewerEmail } from '../services/sendMailServices/sendScheduleInterviewerEmail.js';
import { sendRescheduledInterviewEmail } from '../services/sendMailServices/sendRescheduledInterviewEmail.js';
import { sendRescheduledInterviewerEmail } from '../services/sendMailServices/sendRescheduledInterviewerEmail.js';
import { sendResetPasswordEmail } from '../services/sendMailServices/sendResetPasswordEmail.js';
import { sendApplicationStatusUpdateEmail } from '../services/sendMailServices/sendApplicationStatusUpdateEmail.js';
import { sendCancelledInterviewEmail } from '../services/sendMailServices/sendCancelledInterviewEmail.js';
import { sendCancelledInterviewerEmail } from '../services/sendMailServices/sendCancelledInterviewerEmail.js';
import { sendCertificateEmail } from '../services/sendMailServices/sendCertificateEmail.js';


// NO QueueScheduler needed in BullMQ v5+
// BullMQ automatically handles delayed jobs, retries, etc. when Worker is active

const worker = new Worker(
  'email',
  async (job) => {
    logger.info(`Processing job ${job.id} - ${job.name}`);

    try {
      if (job.name === 'welcome-candidate') {
        await sendWelcomeEmail(job.data);
      } 
      else if (job.name === 'verification-mail') {
        await sendVerificationEmail(job.data);
      } 
      else if (job.name === 'enroll-candidate') {
        await sendEnrollEmail(job.data);
      } 
      else if (job.name === 'schedule-interview') {
        // Send to both candidate and interviewer
        await sendScheduleInterviewEmail(job.data);
        await sendScheduleInterviewerEmail(job.data);
      } 
      else if (job.name === 'reschedule-interview') {
        // Send to both candidate and interviewer
        await sendRescheduledInterviewEmail(job.data);
        await sendRescheduledInterviewerEmail(job.data);
      } 
      else if (job.name === 'reset-password') {
        await sendResetPasswordEmail(job.data);
      } else if (job.name === "application-status-update") {
        await sendApplicationStatusUpdateEmail(job.data);
      } 
      else if (job.name === "cancel-interview") {
        await sendCancelledInterviewEmail(job.data);
      }

      else if (job.name === "cancel-interview-interviewer") {
        await sendCancelledInterviewerEmail(job.data);
      } 
      else if (job.name === "certificate-email") {
        await sendCertificateEmail(job.data);
      }

      
      else {
        logger.warn(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      logger.error(`Job ${job.id} failed: ${error.message}`, { error });
      throw error; // Let BullMQ handle retry logic
    }
  },
  {
    connection,
    concurrency: 5, // Process up to 5 emails concurrently
  }
);

// Worker event listeners
worker.on('completed', (job) => {
  logger.info(`Job ${job.id} (${job.name}) completed successfully`);
});

worker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} (${job?.name}) failed: ${err.message}`, { error: err });
});

worker.on('error', (err) => {
  logger.error('Worker encountered an error:', { error: err });
});

logger.info('BullMQ Email Worker started — ready to process email jobs!');
