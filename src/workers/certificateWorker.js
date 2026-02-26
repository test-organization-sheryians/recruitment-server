import { Worker } from "bullmq";
import connection from "../config/config/bullmq-connection.js";
import logger from "../utils/logger.js";
import CertificateService from "../services/certificate.service.js";
import { emailQueue } from "../queues/emailQueue.js";

const certificateService = new CertificateService();

const worker = new Worker(
  "certificate",
  async (job) => {
    logger.info(`Processing job ${job.id} - ${job.name}`);

    try {
      if (job.name === "bulk-certificate-generation") {
        const { students, triggeredBy } = job.data;

        logger.info(
          `Bulk generation started for ${students.length} students. Admin: ${triggeredBy}`,
        );

        // Step 1 — Generate PDFs + upload to S3 via CertificateService
        const results = await certificateService.generateBulkCertificates(
          students,
          async (done, total) => {
            await job.updateProgress(Math.round((done / total) * 100));
          },
        );

        const successful = results.filter((r) => r.status === "success");
        const failed = results.filter((r) => r.status === "failed");

        logger.info(
          `Done: ${successful.length} success, ${failed.length} failed`,
        );

        // Step 2 — Add email job for each successful certificate
        // ✅ Reuses existing emailQueue — emailWorker picks it up automatically
        await Promise.all(
          successful.map((result) =>
            emailQueue.add(
              "send-certificate",
              {
                to: result.email,
                name: result.name,
                internshipRole: result.internshipRole,
                startDate: result.startDate,
                endDate: result.endDate,
                certificateUrl: result.certificateUrl,
              },
              {
                attempts: 5,
                backoff: { type: "exponential", delay: 3000 },
              },
            ),
          ),
        );

        logger.info(`${successful.length} email jobs added to email queue`);

        // Return summary — visible in Bull Board
        return {
          total: students.length,
          successful: successful.length,
          failed: failed.length,
          failedStudents: failed.map((r) => ({ name: r.name, error: r.error })),
        };
      } else {
        logger.warn(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      logger.error(`Job ${job.id} failed: ${error.message}`, { error });
      throw error; // BullMQ handles retry
    }
  },
  {
    connection,
    concurrency: 1, // Puppeteer is heavy — keep at 1
  },
);

// ─── Event Listeners — same pattern as emailWorker.js ───────────────────────
worker.on("completed", (job, result) => {
  logger.info(
    `✅ Job ${job.id} completed — ${result?.successful}/${result?.total} certificates`,
  );
});

worker.on("failed", (job, err) => {
  logger.error(`❌ Job ${job?.id} (${job?.name}) failed: ${err.message}`, {
    error: err,
  });
});

worker.on("progress", (job, progress) => {
  logger.info(`Job ${job.id} progress: ${progress}%`);
});

worker.on("error", (err) => {
  logger.error("Certificate worker error:", { error: err });
});

logger.info("🎓 Certificate Worker started!");
