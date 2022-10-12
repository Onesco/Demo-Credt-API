import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UpdateFundDto, TransferFundDto } from './dto/update-fund.dto';
import { FundUserDto } from './dto/fund-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.userService.findAll(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMe(@Request() req) {
    return this.userService.findMe(req.user);
  }

  @ApiParam({ name: 'id', type: 'integer' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.userService.findOne(+id, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('me/fund')
  async fundAccount(@Body() fundUserDto: FundUserDto, @Request() req) {
    return this.userService.fund(fundUserDto, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('me/withdraw')
  async withdrawAmount(@Body() updateFundDto: UpdateFundDto, @Request() req) {
    return this.userService.withdrawFund(updateFundDto.amount, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('me/transfer')
  async transferFund(@Body() transferFundDto: TransferFundDto, @Request() req) {
    return this.userService.transferFund(
      transferFundDto.amount,
      req.user.id,
      transferFundDto.to,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/balance')
  async getBalance(@Request() req) {
    return await this.userService.checkBalance(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/transactions')
  async getTransactions(@Request() req) {
    return await this.userService.getTransactions(req.user.id);
  }

  @ApiParam({ name: 'txn_type', enum: ['debit', 'credit', 'transfer'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/transactions/:txn_type')
  async getTransactionsByType(
    @Request() req,
    @Param('txn_type') txn_type: string,
  ) {
    return await this.userService.getTransactionsByType(req.user.id, txn_type);
  }
}
