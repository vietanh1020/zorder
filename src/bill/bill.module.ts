import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Bill } from '@/database/entities';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MikroOrmModule.forFeature([Bill])],
  controllers: [BillController],
  providers: [BillService, JwtService],
})
export class BillModule {}
