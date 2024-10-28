import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../../services/transaction';
import { ValidationError } from '../../utils/errors';
import logger from '../../utils/logger';
import { createTransactionSchema } from '../validators/transaction.validator';

export async function createTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = createTransactionSchema.parse(req.body);
    const transaction = await TransactionService.create(validatedData);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
}

export async function getTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const transaction = await TransactionService.findById(id);
    res.json(transaction);
  } catch (error) {
    next(error);
  }
}

export async function uploadScreenshot(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new ValidationError('Файл не загружен');
    }

    const { id } = req.params;
    const screenshot = await TransactionService.addScreenshot(id, req.file.path);
    res.json(screenshot);
  } catch (error) {
    next(error);
  }
}