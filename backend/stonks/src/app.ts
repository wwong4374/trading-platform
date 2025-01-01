import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { router as securityRouter } from './controllers/security';

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173' // Vite's default port
        : process.env.FRONTEND_URL,
  })
);

// ROUTES
app.use('/securities', securityRouter);

export { app };
