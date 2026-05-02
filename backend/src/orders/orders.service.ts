import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, OrderStatus, PaymentStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartItem } from '../cart/cart.entity';
import { sendShippedEmail } from '../mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,
    @InjectRepository(CartItem)
    private cartRepo: Repository<CartItem>,
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
}
