import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../../../auth.middleware.js';

const prisma = new PrismaClient();
const router = Router();

// Protect all routes in this file
router.use(protect);

// GET dashboard stats
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const subcategoryCount = await prisma.subcategory.count();

    res.json({
      products: productCount,
      categories: categoryCount,
      subcategories: subcategoryCount,
    });
  } catch (error) {
    next(error);
  }
});

export default router; 