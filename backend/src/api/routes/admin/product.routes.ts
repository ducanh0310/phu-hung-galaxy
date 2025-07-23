import { Router, Request, Response, NextFunction } from 'express';
import { productService } from '../../services/product.service.js';
import { validate } from '../../../middlewares.js';
import {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
} from '../../validation/product.validation.js';
import { protect } from '../../../auth.middleware.js';

const router = Router();

// Protect all routes in this file
router.use(protect);

// GET all products for admin
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Using existing service function to get all products without filters
    const products = await productService.getProducts({});
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// POST a new product
router.post('/', validate(createProductSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// PUT to update a product
router.put('/:id', validate(updateProductSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productService.updateProduct(id, req.body);
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// DELETE a product
router.delete('/:id', validate(deleteProductSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
});

export default router; 