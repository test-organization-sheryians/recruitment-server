import config from "./environment.js";

const AllowedOrigins = config.ALLOWED_ORIGINS?.split(",") || [];

export const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
