import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../../middlewares.js';

const prisma = new PrismaClient();

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

const getAllCategoriesWithSubcategories = async () => {
  return prisma.category.findMany({
    include: {
      subcategories: true,
    },
  });
};

// Category CRUD
const createCategory = async (data: { name: string; icon: string }) => {
  const categoryId = slugify(data.name);
  return prisma.category.create({
    data: {
      ...data,
      id: categoryId,
    },
  });
};

const updateCategory = async (id: string, data: Prisma.CategoryUpdateInput) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

const deleteCategory = async (id: string) => {
  const subcategories = await prisma.subcategory.findMany({
    where: { categoryId: id },
    select: { id: true },
  });

  if (subcategories.length > 0) {
    const subcategoryIds = subcategories.map((s) => s.id);
    const productCount = await prisma.product.count({
      where: { subcategoryId: { in: subcategoryIds } },
    });

    if (productCount > 0) {
      throw new AppError('Cannot delete category. Subcategories contain products.', 400);
    }
  }

  return prisma.$transaction([
    prisma.subcategory.deleteMany({ where: { categoryId: id } }),
    prisma.category.delete({ where: { id } }),
  ]);
};

// Subcategory CRUD
const createSubcategory = async (data: { name:string, categoryId: string }) => {
  const subcategoryId = slugify(`${data.categoryId}-${data.name}`);
  return prisma.subcategory.create({
    data: {
      ...data,
      id: subcategoryId,
    },
  });
};

const updateSubcategory = async (id: string, data: Prisma.SubcategoryUpdateInput) => {
  return prisma.subcategory.update({
    where: { id },
    data,
  });
};

const deleteSubcategory = async (id: string) => {
  const productCount = await prisma.product.count({
    where: { subcategoryId: id },
  });

  if (productCount > 0) {
    throw new AppError('Cannot delete subcategory. It is associated with products.', 400);
  }

  return prisma.subcategory.delete({
    where: { id },
  });
};

export const categoryService = {
  getAllCategoriesWithSubcategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
