import { Router, Request, Response, NextFunction } from 'express';
import { protectUser } from '../../user.auth.middleware.js';
import { validate } from '../../middlewares.js';
import { orderService } from '../services/order.service.js';
import { createOrderSchema, getOrderByIdSchema } from '../validation/order.validation.js';

const router = Router();

// Protect all order routes
router.use(protectUser);

// POST /orders - Create a new order from the cart
router.post('/', validate(createOrderSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shippingAddress } = req.body;
    const order = await orderService.createOrder(req.user!.id, shippingAddress);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// GET /orders - Get user's order history
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getOrders(req.user!.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// GET /orders/:id - Get a specific order
router.get('/:id', validate(getOrderByIdSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(req.user!.id, id);
    res.json(order);
  } catch (error) {
    next(error);
  }
});

export default router;