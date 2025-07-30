import prisma from '../../prisma.service.js';
import { AppError } from '../../middlewares.js';

class OrderService {
  async createOrder(userId: string, shippingAddress?: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cannot create order from an empty cart', 400);
    }

    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // Transaction to ensure data integrity
    return prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const order = await tx.order.create({
        data: {
          userId,
          total,
          shippingAddress,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price, // Store price at time of purchase
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // 2. Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  async getOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }
}

export const orderService = new OrderService();