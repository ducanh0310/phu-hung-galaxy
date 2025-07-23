import { Router } from 'express';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import authRoutes from './auth.routes.js';
import adminProductRoutes from './admin/product.routes.js';
import adminCategoryRoutes from './admin/category.routes.js';
import adminDashboardRoutes from './admin/dashboard.routes.js';

const router = Router();

router.use(categoryRoutes);
router.use(productRoutes);
router.use(authRoutes);
router.use('/admin/products', adminProductRoutes);
router.use('/admin', adminCategoryRoutes);
router.use('/admin/dashboard', adminDashboardRoutes);

export default router;
