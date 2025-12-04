// config/bullmq-connection.js
// This is the BullMQ version of your Redis connection
// Same Redis as everything else — no duplication

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};

export default connection;