import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
