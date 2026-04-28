import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private repo: Repository<CartItem>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  // 🟢 Add to cart
  async addToCart(userId: string, productId: string, quantity: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) throw new Error('Product not found');

    let item = await this.repo.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
    });

    if (item) {
      item.quantity += quantity;
    } else {
      item = this.repo.create({
        user: { id: userId },
        product,
        quantity,
      });
    }

    return this.repo.save(item);
  }

  // 🟢 Get cart
  async getCart(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } },
    });
  }

  // 🟢 Update quantity
  async updateQuantity(userId: string, itemId: string, quantity: number) {
    const item = await this.repo.findOne({
      where: { id: itemId, user: { id: userId } },
    });

    if (!item) throw new Error('Item not found');

    item.quantity = quantity;

    return this.repo.save(item);
  }

  // 🟢 Remove item
  async removeItem(userId: string, itemId: string) {
    const item = await this.repo.findOne({
      where: { id: itemId, user: { id: userId } },
    });

    if (!item) throw new Error('Item not found');

    await this.repo.remove(item);

    return { message: 'Item removed from cart' };
  }
}