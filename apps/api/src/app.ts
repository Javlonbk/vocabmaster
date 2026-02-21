import express, { type NextFunction, type Request, type Response, type Router } from 'express';

import { authRouter } from './auth-routes';
import { ApiError, toApiErrorBody } from './errors';
import { learningRouter } from './learning-routes';

type AppDeps = {
  authRoutes?: Router;
  learningRoutes?: Router;
};

export function createApp(deps: AppDeps = {}) {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/v1/auth', deps.authRoutes ?? authRouter);
  app.use('/v1/learning', deps.learningRoutes ?? learningRouter);

  app.use((_req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found'
      }
    });
  });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof ApiError) {
      res.status(error.status).json(toApiErrorBody(error));
      return;
    }

    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  });

  return app;
}
