import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globaux ───────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────
app.use('/api', router);

app.get('/', (_req, res) => {
  res.json({ message: 'API opérationnelle', version: '1.0.0' });
});

// ─── Gestion des erreurs (toujours en dernier) ────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Démarrage ────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`Serveur démarré sur http://localhost:${PORT}`);
  logger.info(`Environnement : ${process.env.NODE_ENV || 'development'}`);
});

