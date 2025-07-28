import { Prisma } from '@prisma/client';
import { AppError } from '../../middlewares.js';
import prisma from '../../prisma.service.js';

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

class CategoryService {
  async getAllCategoriesWithSubcategories() {
    return prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });
  }

  // Category CRUD
  async createCategory(data: { name: string; icon: string }) {
    const categoryId = slugify(data.name);
    return prisma.category.create({
      data: {
        ...data,
        id: categoryId,
      },
    });
  }

  async updateCategory(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: string) {
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
  }

  // Subcategory CRUD
  async createSubcategory(data: { name: string; categoryId: string }) {
    const subcategoryId = slugify(`${data.categoryId}-${data.name}`);
    return prisma.subcategory.create({
      data: {
        ...data,
        id: subcategoryId,
      },
    });
  }

  async updateSubcategory(id: string, data: Prisma.SubcategoryUpdateInput) {
    return prisma.subcategory.update({
      where: { id },
      data,
    });
  }

  async deleteSubcategory(id: string) {
    const productCount = await prisma.product.count({
      where: { subcategoryId: id },
    });

    if (productCount > 0) {
      throw new AppError('Cannot delete subcategory. It is associated with products.', 400);
    }

    return prisma.subcategory.delete({
      where: { id },
    });
  }
}
export const categoryService = new CategoryService();
