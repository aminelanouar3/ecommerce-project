import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Patch, Param } from '@nestjs/common';
import { UpdateAddressDto } from './dto/update-address.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.addressesService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressesService.update(req.user.userId, id, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.addressesService.remove(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/default')
  setDefault(@Req() req, @Param('id') id: string) {
    return this.addressesService.setDefault(req.user.userId, id);
  }
}