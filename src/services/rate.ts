import { prisma } from '../db';
import { cache } from '../utils/cache';
import logger from '../utils/logger';
import fetch from 'node-fetch';

export class RateService {
  static async updateRates() {
    try {
      // Получаем курсы с нескольких источников для надежности
      const [binanceRate, huobiRate] = await Promise.all([
        this.fetchBinanceRate(),
        this.fetchHuobiRate()
      ]);

      const averageRate = (binanceRate + huobiRate) / 2;

      await prisma.exchangeRate.create({
        data: {
          from: 'USDT',
          to: 'RUB',
          rate: averageRate,
          source: 'AVERAGE'
        }
      });

      // Кэшируем курс на 5 минут
      cache.set('rate:RUB:USDT', averageRate, 300000);
      
      logger.info(`Updated exchange rate: 1 USDT = ${averageRate} RUB`);
    } catch (error) {
      logger.error('Failed to update exchange rates:', error);
    }
  }

  private static async fetchBinanceRate(): Promise<number> {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTRUB');
    const data = await response.json();
    return parseFloat(data.price);
  }

  private static async fetchHuobiRate(): Promise<number> {
    const response = await fetch('https://api.huobi.pro/market/detail/merged?symbol=usdtrub');
    const data = await response.json();
    return (data.tick.bid[0] + data.tick.ask[0]) / 2;
  }
}