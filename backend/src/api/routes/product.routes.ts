import { Router, Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service.js';
import { validate } from '../../middlewares.js';
import { getProductByIdSchema, getProductsSchema } from '../validation/product.validation.js';

const router = Router();

// Get products with filtering and search
router.get('/products', validate(getProductsSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subcategory, q } = req.query;
    const products = await productService.getProducts({
      subcategory: subcategory as string | undefined,
      q: q as string | undefined,
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Get a single product by ID
router.get('/products/:id', validate(getProductByIdSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      // Use a 404 status for not found resources
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

export default router;
