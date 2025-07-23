import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface GetProductsFilter {
  subcategory?: string;
  q?: string;
}

const getProducts = async (filters: GetProductsFilter) => {
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
};

const getProductById = async (id: string) => {
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
};

const createProduct = async (data: Prisma.ProductCreateInput) => {
  return prisma.product.create({
    data,
  });
};

const updateProduct = async (id: string, data: Prisma.ProductUpdateInput) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};

export const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
