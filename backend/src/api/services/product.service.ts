import { Prisma } from '@prisma/client';
import prisma from '../../prisma.service.js';

interface GetProductsFilter {
  subcategory?: string;
  q?: string;
}

class ProductService {
  async getProducts(filters: GetProductsFilter) {
    const { subcategory, q } = filters;
    const where: NonNullable<Parameters<typeof prisma.product.findMany>[0]>['where'] = {};

    if (subcategory) {
      where.subcategoryId = subcategory;
    }

    if (q) {
      const searchQuery = q;
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    return prisma.product.findMany({
      where,
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
    });
    return product;
  }

  async createProduct(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
    });
  }

  async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}

export const productService = new ProductService();
