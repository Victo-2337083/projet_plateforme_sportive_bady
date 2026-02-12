import express from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { env } from './common/env';

export const createServer = () => {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({
      message: 'Back_End_Web3 API ready',
      docs: '/docs/swagger.yaml',
    });
  });

  app.use('/docs', express.static('src/public'));
  app.use('/api', apiRouter);

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = error instanceof Error ? error.message : 'Erreur interne';
    res.status(500).json({ message });
  });

  return app;
};
