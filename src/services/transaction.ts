import { prisma } from '../db';
import { cache } from '../utils/cache';
import { NotFoundError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';
import { bot } from '../bot';
import config from '../config';

export interface CreateTransactionDTO {
  amount: number;
  currency: string;
  paymentMethod: string;
}

export class TransactionService {
  static async create(dto: CreateTransactionDTO) {
    const rate = await cache.get(`rate:${dto.currency}:USDT`);
    if (!rate) {
      throw new ValidationError('Не удалось получить курс обмена');
    }

    const availableOperators = await prisma.user.findMany({
      where: {
        maxBalance: {
          gte: dto.amount * rate
        },
        balance: {
          gte: dto.amount * rate
        }
      }
    });

    if (availableOperators.length === 0) {
      throw new ValidationError('Нет доступных операторов');
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: dto.amount,
        currency: dto.currency,
        paymentMethod: dto.paymentMethod,
        status: 'pending',
        expiresAt: new Date(Date.now() + config.TRANSACTION_TIMEOUT),
        userId: availableOperators[0].id
      }
    });

    // Отправляем уведомления операторам
    for (const operator of availableOperators) {
      try {
        await bot.telegram.sendMessage(
          Number(operator.telegramId),
          `Новая заявка на обмен:\n\n` +
          `Сумма: ${dto.amount} ${dto.currency}\n` +
          `Метод: ${dto.paymentMethod}\n\n` +
          `Нажмите для принятия заявки:`,
          {
            reply_markup: {
              inline_keyboard: [[
                { 
                  text: 'Принять заявку',
                  callback_data: `accept_transaction:${transaction.id}`
                }
              ]]
            }
          }
        );
      } catch (error) {
        logger.error(`Failed to notify operator ${operator.telegramId}:`, error);
      }
    }

    return transaction;
  }

  static async accept(transactionId: string, operatorId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) {
      throw new NotFoundError('Транзакция не найдена');
    }

    if (transaction.status !== 'pending') {
      throw new ValidationError('Транзакция уже обработана');
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'accepted',
        userId: operatorId
      }
    });

    // Отменяем заявку у других операторов
    const operator = await prisma.user.findUnique({
      where: { id: operatorId }
    });

    if (operator) {
      await bot.telegram.sendMessage(
        Number(operator.telegramId),
        `Заявка ${transactionId} принята вами.\n` +
        `Ожидайте оплату.`
      );
    }

    return transaction;
  }
}