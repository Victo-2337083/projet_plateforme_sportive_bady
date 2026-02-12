import { Router } from 'express';
import { mysqlConfig } from '../common/prisma';
import { healthView } from '../views/health.view';

const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  const db = mysqlConfig.isConfigured ? 'configured' : 'missing DATABASE_URL';
  res.json(healthView.ok({ db }));
});

export default healthRouter;
