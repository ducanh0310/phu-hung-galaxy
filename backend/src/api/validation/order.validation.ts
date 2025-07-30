import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z.string().optional(),
  }),
});

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
});