// server.js (or index.js — your main entry file)
import app from "./src/app.js";
import config from "./src/config/environment.js";
import { connectRedis } from "./src/config/redis.js";
import { connectDB } from "./src/config/database.js";
import logger from "./src/utils/logger.js";

// THIS LINE STARTS THE BULLMQ WORKER AUTOMATICALLY
import "./src/workers/emailWorker.js";  // ← JUST THIS ONE LINE
import jobApplicationModel from "./src/models/jobApplication.model.js";
import userModel from "./src/models/user.model.js";

const { PORT } = config;

async function startServer() {
  try {
    await connectDB();
    logger.info("MongoDB connected successfully");

    await connectRedis();
    logger.info("Redis connected successfully");
        //  console.log(await jobApplicationModel.deleteMany({}))
          // console.log(await userModel.deleteOne({email:"anshur9608837@gmail.com"}))



    // ← Worker is already running in background from the import above
    // You will see: "BullMQ Email Worker started and waiting for jobs..."

    app.listen(PORT, () => {
      logger.info(`Server + BullMQ Worker running on http://localhost:${PORT}`);
      logger.info(`Admin panel (optional): http://localhost:${PORT}/admin/queues`);
    });
  } catch (error) {
    logger.error("Server failed to start:", error);
    process.exit(1);
  }
}

startServer();