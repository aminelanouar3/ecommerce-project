import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // 🔹 Find user by email

  // 🔹 Create new user
  async create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  // 🔹 Find user by ID
  async findById(id: string): Promise<Omit<User, 'password'> | null> {
  const user = await this.repo.findOne({ where: { id } });
  if (!user) return null;

  // destructure password out
  const { password, ...result } = user;
  return result;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
  const user = await this.repo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  // check if current password matches
  const match = await bcrypt.compare(dto.currentPassword, user.password);
  if (!match) throw new BadRequestException('Current password is incorrect');

  // hash new password
  user.password = await bcrypt.hash(dto.newPassword, 10);

  // save
  await this.repo.save(user);

  return { message: 'Password updated successfully' };
}

async findByEmail(email: string) {
  return this.repo.findOne({ where: { email } });
}

async findByResetToken(token: string) {
  return this.repo.findOne({ where: { resetToken: token } });
}

async save(user: User) {
  return this.repo.save(user);
}
}
