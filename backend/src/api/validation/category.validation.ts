import { z } from 'zod';

// Category Schemas
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    icon: z.string().min(1, 'Icon is required (e.g., fa-solid fa-cookie-bite)'),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Category ID is required'),
  }),
  body: z
    .object({
      name: z.string().min(1, 'Name is required'),
      icon: z.string().min(1, 'Icon is required'),
    })
    .partial(),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Category ID is required'),
  }),
});

// Subcategory Schemas
export const createSubcategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    categoryId: z.string().min(1, 'Category ID is required'),
  }),
});

export const updateSubcategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Subcategory ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required'),
  }).partial(),
});

export const deleteSubcategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Subcategory ID is required'),
  }),
}); 