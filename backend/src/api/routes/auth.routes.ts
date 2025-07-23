import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { validate } from '../../middlewares.js';
import { loginSchema } from '../validation/auth.validation.js';

const router = Router();

router.post('/auth/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

export default router; 