import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string(),
  TELEGRAM_BOT_TOKEN: z.string(),
  ADMIN_TELEGRAM_ID: z.string().transform(Number),
  JWT_SECRET: z.string(),
  UPLOAD_DIR: z.string(),
  RATE_UPDATE_INTERVAL: z.string().transform(Number),
  TRANSACTION_TIMEOUT: z.string().transform(Number),
});

const config = configSchema.parse({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3000',
  DATABASE_URL: process.env.DATABASE_URL,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  ADMIN_TELEGRAM_ID: process.env.ADMIN_TELEGRAM_ID,
  JWT_SECRET: process.env.JWT_SECRET,
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  RATE_UPDATE_INTERVAL: process.env.RATE_UPDATE_INTERVAL || '300000', // 5 минут
  TRANSACTION_TIMEOUT: process.env.TRANSACTION_TIMEOUT || '900000', // 15 минут
});

export default config;