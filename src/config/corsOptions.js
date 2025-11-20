
export const corsOptions = {
  origin: true,                   // ← Yeh line sab kuch allow kar degi
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};