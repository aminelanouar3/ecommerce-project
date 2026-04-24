import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Address } from './address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly repo: Repository<Address>,
  ) {}

  async create(userId: string, dto: CreateAddressDto) {
    const address = this.repo.create({
      ...dto,
      user: { id: userId },
    });

    return this.repo.save(address);
  }

  async findAll(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } },
    });
  }

  async update(userId: string, id: string, dto: UpdateAddressDto) {
  const address = await this.repo.findOne({
    where: { id, user: { id: userId } },
  });

  if (!address) {
    throw new Error('Address not found');
  }

  Object.assign(address, dto);

  return this.repo.save(address);
  }

  async remove(userId: string, id: string) {
  const address = await this.repo.findOne({
    where: { id, user: { id: userId } },
  });

  if (!address) {
    throw new Error('Address not found');
  }

  await this.repo.remove(address);

  return { message: 'Address deleted successfully' };
  }

  async setDefault(userId: string, id: string) {
  // 1. Find all user addresses
  const addresses = await this.repo.find({
    where: { user: { id: userId } },
  });

  // 2. Remove default from all
  for (const addr of addresses) {
    addr.isDefault = false;
  }

  await this.repo.save(addresses);

  // 3. Find selected address
  const address = await this.repo.findOne({
    where: { id, user: { id: userId } },
  });

  if (!address) {
    throw new Error('Address not found');
  }

  // 4. Set as default
  address.isDefault = true;

  return this.repo.save(address);
  }
}