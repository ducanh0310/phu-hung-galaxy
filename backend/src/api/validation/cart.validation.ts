import { z } from 'zod';

export const addItemToCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    productId: z.string().min(1, 'Product ID is required'),
  }),
  body: z.object({
    quantity: z.number().int().positive('Quantity must be a positive integer'),
  }),
});

export const deleteCartItemSchema = z.object({
  params: z.object({
    productId: z.string().min(1, 'Product ID is required'),
  }),
});