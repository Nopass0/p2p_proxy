import { Telegraf, Scenes, session } from 'telegraf';
import config from '../config';
import { registerCommands } from './commands';
import { setupMiddleware } from './middleware';
import logger from '../utils/logger';
import { setupScenes } from './scenes';

export const bot = new Telegraf<Scenes.SceneContext>(config.TELEGRAM_BOT_TOKEN);

export async function startBot() {
  try {
    const stage = setupScenes();
    
    bot.use(session());
    bot.use(stage.middleware());
    
    setupMiddleware(bot);
    registerCommands(bot);

    await bot.launch();
    logger.info('Telegram bot started successfully');

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (error) {
    logger.error('Failed to start Telegram bot:', error);
    throw error;
  }
}

export default bot;