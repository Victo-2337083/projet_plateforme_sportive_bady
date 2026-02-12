import { Request, Response } from 'express';
import { sendError } from '../utils/response';

export const notFound = (_req: Request, res: Response): void => {
  sendError(res, 'Route introuvable', 404);
};

