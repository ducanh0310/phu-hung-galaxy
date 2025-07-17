import { z } from 'zod';

export const getProductsSchema = z.object({
  query: z.object({
    subcategory: z.string().optional(),
    q: z.string().optional(),
  }),
});

export const getProductByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: 'Product ID is required' }),
  }),
});
