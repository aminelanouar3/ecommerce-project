import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, OrderStatus, PaymentStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartItem } from '../cart/cart.entity';
import { sendShippedEmail } from '../mail/mail.service';
import { Product } from 'src/products/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,
    @InjectRepository(CartItem)
    private cartRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // 🟢 CREATE ORDER (checkout)
  async createOrder(userId: string) {
    const cartItems = await this.cartRepo.find({
      where: { user: { id: userId } },
    });
    if (!cartItems.length) {
      throw new Error('Cart is empty');
    }
    let total = 0;
    const items = cartItems.map((cart) => {
      total += cart.product.price * cart.quantity;
      return this.itemRepo.create({
        product: cart.product,
        quantity: cart.quantity,
        price: cart.product.price,
      });
    });
    const order = this.orderRepo.create({
      user: { id: userId },
      items,
      totalPrice: total,
      orderStatus: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
    });
    await this.orderRepo.save(order);
    await this.cartRepo.remove(cartItems);
    return order;
  }

  // 🟢 USER: get own orders
  async getUserOrders(userId: string) {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  // 🟢 ADMIN: get all orders
  async getAllOrders() {
    return this.orderRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  // 🟢 ADMIN: update status
  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });
    if (!order) throw new Error('Order not found');
    order.orderStatus = status;
    if (status === OrderStatus.SHIPPED) {
      await sendShippedEmail(order.user.email, order.id);
    }
    return this.orderRepo.save(order);
  }

  async deleteAllOrders() {
    await this.orderRepo.query(`
  TRUNCATE TABLE orders CASCADE;
`);
    return { message: 'All orders deleted' };
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.orderRepo.findOne({
      where: {
        id: orderId,
        user: { id: userId },
      },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      return {
        success: false,
        message: 'Order not found',
      };
    }
    if (order.paymentStatus === PaymentStatus.PAID) {
      return {
        success: false,
        message: 'Cannot cancel a paid order',
      };
    }

    if (order.orderStatus === OrderStatus.CANCELLED) {
      return {
        success: false,
        message: 'Order already cancelled',
      };
    }
    // restore stock
    for (const item of order.items) {
      item.product.stock += item.quantity;
      await this.productRepo.save(item.product);
    }
    order.orderStatus = OrderStatus.CANCELLED;
    order.paymentStatus = PaymentStatus.FAILED;
    await this.orderRepo.save(order);
    return {
      success: true,
      message: 'Order cancelled and stock restored',
    };
  }
}
