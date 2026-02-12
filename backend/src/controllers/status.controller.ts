import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import { prisma } from '../config/prisma';

export const getStatus = async (_req: Request, res: Response): Promise<void> => {
  let dbStatus = 'non connectée';
  try {
    // Vérifie la connexion à la base de données
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connectée';
  } catch (error) {
    dbStatus = 'erreur de connexion';
  }
  sendSuccess(res, {
    status: 'OK',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
};

