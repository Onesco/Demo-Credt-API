import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateFundDto, TransferFundDto } from './dto/update-fund.dto';
import { FundUserDto } from './dto/fund-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('fund')
  async fundAccount(@Body() fundUserDto: FundUserDto, @Request() req) {
    return this.userService.fund(fundUserDto, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  async withdrawAmount(@Body() updateFundDto: UpdateFundDto, @Request() req) {
    return this.userService.withdrawFund(updateFundDto.amount, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async transferFund(@Body() transferFundDto: TransferFundDto, @Request() req) {
    return this.userService.transferFund(
      transferFundDto.amount,
      req.user.id,
      transferFundDto.to,
    );
  }
}
