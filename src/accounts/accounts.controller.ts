import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  bankName: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  balance: number;
}

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAccount(@Req() req, @Body() dto: CreateAccountDto) {
    return this.accountsService.createAccount(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAccounts(@Req() req) {
    return this.accountsService.getAccounts(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getBalance(@Req() req) {
    return this.accountsService.getBalance(req.user.userId);
  }
}
