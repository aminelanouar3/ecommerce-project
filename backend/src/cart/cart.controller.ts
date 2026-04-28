import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  add(@Req() req, @Body() body) {
    return this.cartService.addToCart(
      req.user.userId,
      body.productId,
      body.quantity,
    );
  }

  @Get()
  get(@Req() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() body) {
    return this.cartService.updateQuantity(
      req.user.userId,
      id,
      body.quantity,
    );
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.userId, id);
  }
}