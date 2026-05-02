import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [OrdersModule], // ✅ important
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
