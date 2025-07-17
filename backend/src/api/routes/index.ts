import { Router } from 'express';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';

const router = Router();

router.use(categoryRoutes);
router.use(productRoutes);

export default router;
