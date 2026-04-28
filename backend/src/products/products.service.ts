import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async create(dto: any) {
    const product = this.repo.create(dto);
    return this.repo.save(product);
  }

  async update(id: string, dto: any) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new Error('Product not found');
    }
    Object.assign(product, dto);
    return this.repo.save(product);
  }

  async remove(id: string) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new Error('Product not found');
    }
    await this.repo.remove(product);
    return { message: 'Product deleted successfully' };
  }

  async findAll() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async search(query: string) {
    return this.repo
      .createQueryBuilder('product')
      .where('LOWER(product.name) LIKE LOWER(:query)', {
        query: `%${query}%`,
      })
      .getMany();
  }

  async filter(min: number, max: number) {
    return this.repo.find({
      where: {
        price: Between(min, max),
      },
    });
  }
}
