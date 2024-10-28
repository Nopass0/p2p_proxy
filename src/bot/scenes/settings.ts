import { Scenes } from 'telegraf';
import { prisma } from '../../db';
import logger from '../../utils/logger';

export const settingsScene = new Scenes.WizardScene(
  'settings',
  async (ctx) => {
    await ctx.reply(
      'Настройка максимального баланса\n\n' +
      'Введите максимальную сумму в USDT, которую вы готовы обработать:'
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !('text' in ctx.message)) {
      await ctx.reply('Пожалуйста, введите число');
      return;
    }

    const amount = parseFloat(ctx.message.text);
    if (isNaN(amount) || amount < 0) {
      await ctx.reply('Пожалуйста, введите корректное положительное число');
      return;
    }

    try {
      const user = await prisma.user.update({
        where: {
          telegramId: BigInt(ctx.from.id)
        },
        data: {
          maxBalance: amount
        }
      });

      await ctx.reply(
        `Максимальный баланс успешно обновлен!\n\n` +
        `Новое значение: ${user.maxBalance} USDT`
      );
      
      logger.info(`User ${ctx.from.id} updated max balance to ${amount}`);
      return ctx.scene.leave();
    } catch (error) {
      logger.error('Error updating max balance:', error);
      await ctx.reply('Произошла ошибка при обновлении. Попробуйте позже.');
      return ctx.scene.leave();
    }
  }
);