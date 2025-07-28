import prisma from '../../prisma.service.js';

class DashboardService {
  async getStats() {
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const subcategoryCount = await prisma.subcategory.count();

    return {
      products: productCount,
      categories: categoryCount,
      subcategories: subcategoryCount,
    };
  }
}

export const dashboardService = new DashboardService();