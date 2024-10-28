import { Context, MiddlewareFn } from 'telegraf';
import { prisma } from '../../db';
import logger from '../../utils/logger';

export const authMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
  try {
    if (!ctx.from) {
      logger.warn('No user data in context');
      await ctx.reply('Ошибка аутентификации');
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        telegramId: BigInt(ctx.from.id)
      }
    });

    if (!user) {
      logger.warn(`Unauthorized access attempt from ${ctx.from.id}`);
      await ctx.reply('Пожалуйста, используйте /start для начала работы');
      return;
    }

    ctx.state.user = user;
    return next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    await ctx.reply('Произошла ошибка аутентификации');
  }
};