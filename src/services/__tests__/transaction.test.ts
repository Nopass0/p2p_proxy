import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import { TransactionService } from "../transaction";
import { prisma } from "../../db";
import { cache } from "../../utils/cache";
import { bot } from "../../bot";

describe("TransactionService", () => {
  beforeEach(() => {
    // Очищаем базу перед каждым тестом
    prisma.transaction.deleteMany();
    prisma.user.deleteMany();
  });

  describe("create", () => {
    it("should create a new transaction", async () => {
      // Мокаем получение курса
      mock.module("../../utils/cache", () => ({
        get: () => 90, // 1 USDT = 90 RUB
      }));

      // Создаем тестового оператора
      const operator = await prisma.user.create({
        data: {
          telegramId: BigInt(123456),
          balance: 1000,
          maxBalance: 1000,
        },
      });

      const dto = {
        amount: 100,
        currency: "RUB",
        paymentMethod: "Сбербанк",
      };

      const transaction = await TransactionService.create(dto);

      expect(transaction).toBeDefined();
      expect(transaction.amount).toBe(dto.amount);
      expect(transaction.status).toBe("pending");
    });

    it("should throw when no operators available", async () => {
      mock.module("../../utils/cache", () => ({
        get: () => 90,
      }));

      const dto = {
        amount: 100000, // Большая сумма
        currency: "RUB",
        paymentMethod: "Сбербанк",
      };

      await expect(TransactionService.create(dto)).rejects.toThrow();
    });
  });

  describe("accept", () => {
    it("should accept transaction", async () => {
      const operator = await prisma.user.create({
        data: {
          telegramId: BigInt(123456),
          balance: 1000,
          maxBalance: 1000,
        },
      });

      const transaction = await prisma.transaction.create({
        data: {
          amount: 100,
          currency: "RUB",
          paymentMethod: "Сбербанк",
          status: "pending",
          userId: operator.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 15),
        },
      });

      const accepted = await TransactionService.accept(
        transaction.id,
        operator.id
      );

      expect(accepted.status).toBe("accepted");
    });
  });
});