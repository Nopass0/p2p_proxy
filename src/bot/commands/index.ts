import { Telegraf, Scenes } from 'telegraf';
import { startCommand } from './start';
import { balanceCommand } from './balance';
import { settingsCommand } from './settings';
import { statsCommand } from './stats';
import { helpCommand } from './help';
import logger from '../../utils/logger';

export function registerCommands(bot: Telegraf<Scenes.SceneContext>) {
  try {
    bot.command('start', startCommand);
    bot.command('balance', balanceCommand);
    bot.command('settings', settingsCommand);
    bot.command('stats', statsCommand);
    bot.command('help', helpCommand);
    
    logger.info('Bot commands registered successfully');
  } catch (error) {
    logger.error('Failed to register bot commands:', error);
    throw error;
  }
}