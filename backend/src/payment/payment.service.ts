import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, PaymentStatus, OrderStatus } from '../orders/order.entity';

@Injectable()
export class PaymentService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia',
  });
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  // CREATE CHECKOUT
  async createCheckout(orderId: string, userId: string) {
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
        message: 'Order not found or not yours',
      };
    }
    if (order.paymentStatus === PaymentStatus.PAID) {
      return {
        success: false,
        message: 'Order already paid',
      };
    }
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: order.items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: order.id,
      },
      success_url: 'http://localhost:4200/success',
      cancel_url: 'http://localhost:4200/cancel',
    });
    return {
      success: true,
      url: session.url,
    };
  }

  // VERIFY WEBHOOK
  verifyWebhook(payload: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  }

  // SUCCESS PAYMENT
  async handleSuccess(data: any) {
    const orderId = data.metadata?.orderId;
    if (!orderId) return;
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });
    if (!order) return;
    if (order.paymentStatus === PaymentStatus.PAID) return;
    order.paymentStatus = PaymentStatus.PAID;
    order.orderStatus = OrderStatus.PROCESSING;
    await this.orderRepo.save(order);
    return {
      success: true,
      message: 'Order marked as PAID',
      orderId,
    };
  }

  // FAILED PAYMENT
  async handleFailed(paymentIntent: any) {
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) return;
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });
    if (!order) return;
    order.paymentStatus = PaymentStatus.FAILED;
    await this.orderRepo.save(order);
    return {
      success: false,
      message: 'Payment failed',
      orderId,
    };
  }

  // GET ORDER STATUS (FOR POSTMAN TESTING)
  async getOrderStatus(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      return {
        success: false,
        message: 'Order not found',
      };
    }
    return {
      success: true,
      id: order.id,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
    };
  }
}
