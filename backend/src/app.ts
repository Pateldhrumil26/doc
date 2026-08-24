import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import documentRoutes from './routes/document.routes.js';
import templateRoutes from './routes/template.routes.js';
import letterheadProfileRoutes from './routes/letterheadProfile.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Letter Pad & Document Editor API',
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/templates', templateRoutes);
  app.use('/api/letterhead-profiles', letterheadProfileRoutes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Centralized Error Middleware
  app.use(errorHandler);

  return app;
};
