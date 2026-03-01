import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    // req.user comes from JwtStrategy validate()
    return this.usersService.findById(req.user.userId);
  }
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, dto);
}
}
