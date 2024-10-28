import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../utils/errors';
import logger from '../../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Ошибка валидации',
      errors: err.errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Для неизвестных ошибок
  return res.status(500).json({
    status: 'error',
    message: 'Внутренняя ошибка сервера',
  });
}