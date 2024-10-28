import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().min(1),
  paymentMethod: z.string().min(1),
});

export const updateTransactionSchema = z.object({
  status: z.enum(['pending', 'accepted', 'completed', 'failed']),
});