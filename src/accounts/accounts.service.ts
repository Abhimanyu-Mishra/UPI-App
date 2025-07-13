import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async createAccount(userId: number, dto: { bankName: string; balance: number }) {
    const account = await this.prisma.bankAccount.create({
      data: {
        bankName: dto.bankName,
        balance: dto.balance,
        userId,
      },
    });
    return account;
  }

  async getAccounts(userId: number) {
    return this.prisma.bankAccount.findMany({
      where: { userId },
      select: { id: true, bankName: true, balance: true, createdAt: true },
    });
  }

  async getBalance(userId: number) {
    const accounts = await this.prisma.bankAccount.findMany({
      where: { userId },
      select: { balance: true, bankName: true },
    });
    const total = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    return { totalBalance: total, accounts };
  }
}
