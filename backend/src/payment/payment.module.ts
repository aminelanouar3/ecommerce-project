import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
@Module({
  imports: [OrdersModule, ProductsModule], // ✅ important
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
