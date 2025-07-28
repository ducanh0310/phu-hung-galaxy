import { Router, Request, Response, NextFunction } from 'express';
 import { protect } from '../../../auth.middleware.js';
import { dashboardService } from '../../services/dashboard.service.js';

const router = Router();

// Protect all routes in this file
router.use(protect);

// GET dashboard stats
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await dashboardService.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

export default router;