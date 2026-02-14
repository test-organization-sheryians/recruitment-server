const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4200',     
  'https://hire.sheryians.com',
  'https://hire.sheryians.com/',
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const msg = `CORS policy: Origin ${origin} is not allowed`;
 
    return callback(new Error(msg));
  },

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};