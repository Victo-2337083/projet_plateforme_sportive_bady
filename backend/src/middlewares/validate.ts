import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { sendError } from '../utils/response';

export const validate =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((d) => d.message);
      sendError(res, 'Données invalides', 400, errors);
      return;
    }
    next();
  };

