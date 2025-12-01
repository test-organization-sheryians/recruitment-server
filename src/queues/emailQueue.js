// src/queues/emailQueue.js
import { Queue } from "bullmq";
import connection from "../config/config/bullmq-connection.js";
export const emailQueue = new Queue("email", {
  connection,  // ← This is your Redis connection
  defaultJobOptions: {
    attempts: 6,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

