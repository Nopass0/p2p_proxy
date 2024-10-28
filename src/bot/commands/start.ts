import { Context } from 'telegraf';
import { prisma } from '../../db';
import logger from '../../utils/logger';

export async function startCommand(ctx: Context) {
  try {
    if (!ctx.from) {
      return ctx.reply('Ошибка: не удалось получить информацию о пользователе');
    }

    const user = await prisma.user.upsert({
      where: {
        telegramId: BigInt(ctx.from.id)
      },
      update: {
        username: ctx.from.username
      },
      create: {
        telegramId: BigInt(ctx.from.id),
        username: ctx.from.username,
        balance: 0,
        maxBalance: 0
      }
    });

    const message = `
Добро пожаловать в P2P обменник!

Ваш ID: ${user.telegramId}
Баланс: ${user.balance} USDT
Максимальный баланс: ${user.maxBalance} USDT

Используйте /help для просмотра доступных команд
    `;

    await ctx.reply(message);
    logger.info(`User ${user.telegramId} started the bot`);
  } catch (error) {
    logger.error('Error in start command:', error);
    await ctx.reply('Произошла ошибка при запуске бота. Попробуйте позже.');
  }
}