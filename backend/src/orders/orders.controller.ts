import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { OrderStatus } from './order.entity';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // 🟢 USER: checkout
  @Post()
  create(@Req() req) {
    return this.ordersService.createOrder(req.user.userId);
  }

  // 🟢 USER: order history
  @Get()
  getMyOrders(@Req() req) {
    return this.ordersService.getUserOrders(req.user.userId);
  }

  // 🔴 ADMIN ONLY
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  getAll() {
    return this.ordersService.getAllOrders();
  }

  // 🔴 ADMIN ONLY
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateOrderStatus(id, status);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('admin/clear')
  clearOrders() {
    return this.ordersService.deleteAllOrders();
  }
  @UseGuards(JwtAuthGuard)
  @Patch('cancel/:id')
  cancelOrder(@Param('id') id: string, @Req() req) {
    return this.ordersService.cancelOrder(id, req.user.id);
  }
}
