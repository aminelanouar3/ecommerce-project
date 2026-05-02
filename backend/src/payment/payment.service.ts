import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, PaymentStatus } from '../orders/order.entity';

@Injectable()
export class PaymentService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia',
  });

  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async createCheckout(orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    if (!order) return null;

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
      metadata: { orderId: order.id },
      success_url: 'http://localhost:4200/success',
      cancel_url: 'http://localhost:4200/cancel',
    });

    return session.url;
  }

  verifyWebhook(payload: Buffer, signature: string) {
  return this.stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
}

  async handleSuccess(session: any) {
    const orderId = session.metadata?.orderId;
    if (!orderId) return;

    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });

    if (!order) return;

    order.paymentStatus = PaymentStatus.PAID;
    await this.orderRepo.save(order);
  }
}