import { Router } from 'express';
import healthcheckRouter from './healthcheck.route';
import categoryRouter from './category.route';
import productRouter from './product.route';

const router = Router();

router.use(healthcheckRouter);
router.use(categoryRouter);
router.use(productRouter);

export default router; 