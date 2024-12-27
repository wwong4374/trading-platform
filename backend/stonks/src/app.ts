import express from 'express';

import { router as securityRouter } from './controllers/security';

const app = express();

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.use('/securities', securityRouter);

export { app };
