import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getAllCategoriesWithSubcategories = async () => {
  return prisma.category.findMany({
    include: {
      subcategories: true,
    },
  });
};

export const categoryService = {
  getAllCategoriesWithSubcategories,
};
