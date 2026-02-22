import cors from 'cors';
import express, { type Router } from 'express';

import { getSwaggerUiHtml, openApiSpec } from './config/openapi';
import { errorHandler, notFoundHandler } from './middlewares/error-handler';
import { authRouter } from './routes/auth-routes';
import { learningRouter } from './routes/learning-routes';
import { readingRouter } from './routes/reading-routes';
import { searchRouter } from './routes/search-routes';

type AppDeps = {
  authRoutes?: Router;
  learningRoutes?: Router;
  readingRoutes?: Router;
  searchRoutes?: Router;
};

export function createApp(deps: AppDeps = {}) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/openapi.json', (_req, res) => {
    res.json(openApiSpec);
  });

  app.get('/docs', (_req, res) => {
    res.type('html').send(getSwaggerUiHtml('/openapi.json'));
  });

  app.use('/v1/auth', deps.authRoutes ?? authRouter);
  app.use('/v1/learning', deps.learningRoutes ?? learningRouter);
  app.use('/v1/reading', deps.readingRoutes ?? readingRouter);
  app.use('/v1/words', deps.searchRoutes ?? searchRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
