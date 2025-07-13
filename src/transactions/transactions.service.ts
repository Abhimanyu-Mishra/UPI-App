import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async sendMoney(senderId: number, receiverId: number, amount: number, fromBankAccountId: number) {
    if (senderId === receiverId) throw new BadRequestException('Cannot send money to yourself');
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    // Find sender's selected account
    const senderAccount = await this.prisma.bankAccount.findFirst({ where: { id: fromBankAccountId, userId: senderId } });
    if (!senderAccount) throw new BadRequestException('Invalid bank account selected');
    if (senderAccount.balance < amount) throw new BadRequestException('Insufficient balance in selected bank');

    // Find receiver's primary account
    const receiverAccount = await this.prisma.bankAccount.findFirst({ where: { userId: receiverId } });
    if (!receiverAccount) throw new NotFoundException('Receiver has no bank account');

    // Start transaction
    let transaction;
    try {
      transaction = await this.prisma.$transaction(async (prisma) => {
        // Deduct from sender's selected account
        await prisma.bankAccount.update({
          where: { id: senderAccount.id },
          data: { balance: { decrement: amount } },
        });
        // Add to receiver's account
        await prisma.bankAccount.update({
          where: { id: receiverAccount.id },
          data: { balance: { increment: amount } },
        });
        // Create transaction record
        return await prisma.transaction.create({
          data: {
            senderId,
            receiverId,
            amount,
            status: TransactionStatus.SUCCESS,
          },
        });
      });
    } catch (e) {
      // If any error, create failed transaction
      await this.prisma.transaction.create({
        data: {
          senderId,
          receiverId,
          amount,
          status: TransactionStatus.FAILED,
        },
      });
      throw new BadRequestException('Transaction failed');
    }
    return { status: 'success', transaction };
  }

  async getTransactionStatus(userId: number, id: number) {
    const txn = await this.prisma.transaction.findFirst({
      where: {
        id,
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    });
    if (!txn) throw new NotFoundException('Transaction not found');
    return txn;
  }

  async getTransactionHistory(userId: number, query: { status?: TransactionStatus; fromDate?: string; toDate?: string }) {
    const where: any = {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    };
    if (query.status) {
      where.status = query.status;
    }
    if (query.fromDate || query.toDate) {
      where.createdAt = {};
      if (query.fromDate) where.createdAt.gte = new Date(query.fromDate);
      if (query.toDate) {
        const toDateObj = new Date(query.toDate);
        toDateObj.setHours(23, 59, 59, 999);
        where.createdAt.lte = toDateObj;
      }
    }
    return this.prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    });
  }
}
