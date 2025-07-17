import { Router, Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service.js';

const router = Router();

// Get all categories with subcategories
router.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategoriesWithSubcategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

export default router;
