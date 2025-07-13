import { Controller, Post, Body, UseGuards, Req, Get, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { IsNotEmpty, IsNumber, Min, IsOptional, IsEnum, IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionStatus } from '@prisma/client';

class SendMoneyDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  fromBankAccountId: number;

  @IsNotEmpty()
  @IsNumber()
  receiverId: number;
}

class TransactionHistoryQuery {
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('send')
  async sendMoney(@Req() req, @Body() dto: SendMoneyDto) {
    return this.transactionsService.sendMoney(req.user.userId, dto.receiverId, dto.amount, dto.fromBankAccountId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/status')
  async getTransactionStatus(@Req() req, @Param('id') id: string) {
    return this.transactionsService.getTransactionStatus(req.user.userId, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getTransactionHistory(@Req() req, @Query() query: TransactionHistoryQuery) {
    return this.transactionsService.getTransactionHistory(req.user.userId, query);
  }
}
