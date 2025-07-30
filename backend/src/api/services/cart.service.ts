import prisma from '../../prisma.service.js';
import { AppError } from '../../middlewares.js';

class CartService {
  // Find or create a cart for a user
  private async findOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }
    return cart;
  }

  async getCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: {
            product: {
              name: 'asc',
            },
          },
        },
      },
    });

    // If user has no cart yet, return an empty structure
    if (!cart) {
      return {
        id: '',
        userId,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return cart;
  }

  async addItemToCart(userId: string, productId: string, quantity: number) {
    const cart = await this.findOrCreateCart(userId);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
    } else {
      return prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: { product: true },
      });
    }
  }

  async updateCartItem(userId: string, productId: string, quantity: number) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    if (quantity <= 0) {
      return this.removeCartItem(userId, productId);
    }

    return prisma.cartItem.update({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
      data: { quantity },
      include: { product: true },
    });
  }

  async removeCartItem(userId: string, productId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      // This case is unlikely if they have items, but good for safety.
      throw new AppError('Cart not found', 404);
    }

    // This will throw P2025 if not found, which is handled by global error handler
    return prisma.cartItem.delete({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
    });
  }
}

export const cartService = new CartService();