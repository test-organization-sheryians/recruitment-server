import { Queue } from "bullmq";
import connection from "../config/config/bullmq-connection.js";

export const certificateQueue = new Queue("certificate", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
