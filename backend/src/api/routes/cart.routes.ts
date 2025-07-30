import { Router, Request, Response, NextFunction } from 'express';
import { protectUser } from '../../user.auth.middleware.js';
import { validate } from '../../middlewares.js';
import { cartService } from '../services/cart.service.js';
import { addItemToCartSchema, updateCartItemSchema, deleteCartItemSchema } from '../validation/cart.validation.js';

const router = Router();

// Protect all cart routes
router.use(protectUser);

// GET /cart - Get the user's cart
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.getCart(req.user!.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

// POST /cart/items - Add an item to the cart
router.post('/items', validate(addItemToCartSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity } = req.body;
    const updatedItem = await cartService.addItemToCart(req.user!.id, productId, quantity);
    res.status(201).json(updatedItem);
  } catch (error) {
    next(error);
  }
});

// PUT /cart/items/:productId - Update item quantity
router.put('/items/:productId', validate(updateCartItemSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const updatedItem = await cartService.updateCartItem(req.user!.id, productId, quantity);
    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
});

// DELETE /cart/items/:productId - Remove an item from the cart
router.delete('/items/:productId', validate(deleteCartItemSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    await cartService.removeCartItem(req.user!.id, productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;