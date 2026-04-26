import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { sendResetCode } from '../mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(password, 10);

    const user = await this.usersService.create(email, hashed);

    return this.generateToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  async forgotPassword(email: string) {
  const user = await this.usersService.findByEmail(email);

  if (!user) {
    return { message: 'If email exists, code sent' };
  }

  // 🔑 Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetToken = code;
  user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 5); // 5 min

  await this.usersService.save(user);

  // 📧 Send email
  await sendResetCode(user.email, code);

  return { message: 'Reset code sent to email' };
}

async resetPassword(token: string, newPassword: string) {
  const user = await this.usersService.findByResetToken(token);

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    throw new Error('Invalid or expired code');
  }

  user.password = await bcrypt.hash(newPassword, 10);

  // cleanup
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await this.usersService.save(user);

  return { message: 'Password reset successful' };
}

  generateToken(user: any) {
    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
        role: user.role,
      }),
    };
  }
}