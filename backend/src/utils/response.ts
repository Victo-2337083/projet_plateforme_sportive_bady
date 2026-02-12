import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Succès',
  status = 200
): void => {
  const body: ApiResponse<T> = { success: true, data, message };
  res.status(status).json(body);
};

export const sendError = (
  res: Response,
  message: string,
  status = 500,
  errors?: string[]
): void => {
  const body: ApiResponse = { success: false, message, errors };
  res.status(status).json(body);
};

