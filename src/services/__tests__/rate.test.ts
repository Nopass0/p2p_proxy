import { describe, it, expect, beforeEach, mock } from "bun:test";
import { RateService } from "../rate";
import { prisma } from "../../db";
import { cache } from "../../utils/cache";

describe("RateService", () => {
  beforeEach(async () => {
    await prisma.exchangeRate.deleteMany();
    cache.clear();
  });

  describe("updateRates", () => {
    it("should update rates from multiple sources", async () => {
      // Мокаем внешние API
      mock.module("node-fetch", () => ({
        default: async (url: string) => {
          if (url.includes("binance")) {
            return {
              json: () => Promise.resolve({ price: "90.5" }),
            };
          }
          if (url.includes("huobi")) {
            return {
              json: () => Promise.resolve({
                tick: { bid: [89.5], ask: [90.5] },
              }),
            };
          }
        },
      }));

      await RateService.updateRates();

      const rate = await cache.get("rate:RUB:USDT");
      expect(rate).toBeDefined();
      expect(typeof rate).toBe("number");

      const dbRate = await prisma.exchangeRate.findFirst({
        where: { from: "USDT", to: "RUB" },
      });
      expect(dbRate).toBeDefined();
    });
  });
});