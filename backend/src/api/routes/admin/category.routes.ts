import { Router, Request, Response, NextFunction } from 'express';
import { categoryService } from '../../services/category.service.js';
import { validate } from '../../../middlewares.js';
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  createSubcategorySchema,
  updateSubcategorySchema,
  deleteSubcategorySchema,
} from '../../validation/category.validation.js';
import { protect } from '../../../auth.middleware.js';

const router = Router();

// Protect all routes in this file
router.use(protect);

// --- Category Routes ---

// POST a new category
router.post('/', validate(createCategorySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

// PUT to update a category
router.put('/:id', validate(updateCategorySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedCategory = await categoryService.updateCategory(id, req.body);
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
});

// DELETE a category
router.delete('/:id', validate(deleteCategorySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// --- Subcategory Routes ---

// POST a new subcategory
router.post('/subcategories', validate(createSubcategorySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newSubcategory = await categoryService.createSubcategory(req.body);
    res.status(201).json(newSubcategory);
  } catch (error) {
    next(error);
  }
});

// PUT to update a subcategory
router.put('/subcategories/:id', validate(updateSubcategorySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedSubcategory = await categoryService.updateSubcategory(id, req.body);
    res.json(updatedSubcategory);
  } catch (error) {
    next(error);
  }
});

// DELETE a subcategory
router.delete('/subcategories/:id', validate(deleteSubcategorySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await categoryService.deleteSubcategory(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router; 