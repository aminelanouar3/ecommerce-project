import {
  Controller,
  Post,
  Param,
  Req,
  Res,
  Headers,
  UseGuards,
  Get,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  @Post('webhook')
  async webhook(
    @Req() req: any,
    @Res() res: Response,
    @Headers('stripe-signature') sig: string,
  ) {
    try {
      const event = this.paymentService.verifyWebhook(req.rawBody, sig);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.paymentService.handleSuccess(event.data.object);
          break;

        case 'payment_intent.payment_failed':
          await this.paymentService.handleFailed(event.data.object);
          break;

        case 'charge.failed':
          await this.paymentService.handleFailed(event.data.object);
          break;
      }

      return res.status(200).json({ received: true });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':orderId')
  async pay(@Param('orderId') orderId: string, @Req() req: any) {
    const url = await this.paymentService.createCheckout(orderId, req.user.id,);
    return { url };
  }

  @Get('order/:id')
  async getOrder(@Param('id') id: string) {
    return this.paymentService.getOrderStatus(id);
  }
}
