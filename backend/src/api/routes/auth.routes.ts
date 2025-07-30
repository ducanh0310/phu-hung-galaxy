import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { userService } from '../services/user.service.js';
import { validate } from '../../middlewares.js';
import { loginSchema, userLoginSchema } from '../validation/auth.validation.js';
import { registerSchema } from '../validation/user.validation.js';

const router = Router();

// --- Admin Auth ---
router.post('/auth/admin/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

// --- User Auth ---
router.post('/auth/register', validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/auth/login', validate(userLoginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const token = await authService.loginUser(email, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;