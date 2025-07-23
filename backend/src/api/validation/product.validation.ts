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

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().positive('Price must be a positive number'),
    imageUrl: z.string().url('Image URL must be a valid URL'),
    description: z.string().min(1, 'Description is required'),
    subcategoryId: z.string().min(1, 'Subcategory is required'),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Product ID is required'),
  }),
  body: z
    .object({
      name: z.string().min(1, 'Name is required'),
      price: z.number().positive('Price must be a positive number'),
      imageUrl: z.string().url('Image URL must be a valid URL'),
      description: z.string().min(1, 'Description is required'),
      subcategoryId: z.string().min(1, 'Subcategory is required'),
    })
    .partial(),
});

export const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Product ID is required'),
  }),
});
