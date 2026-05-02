import {
  Controller,
  Post,
  Param,
  Req,
  Res,
  Headers,
  UseGuards,
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

    if (event.type === 'checkout.session.completed') {
      await this.paymentService.handleSuccess(event.data.object);
    }

    return res.json({ received: true });
  } catch (err) {
    console.error(err);
    return res.status(400).send(err.message);
  }
}
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':orderId')
  async pay(@Param('orderId') orderId: string) {
    const url = await this.paymentService.createCheckout(orderId);
    return { url };
  }
}
