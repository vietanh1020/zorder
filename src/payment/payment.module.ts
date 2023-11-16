import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { StripeService } from './stripe.service';
import { CardService } from './card.service';
import { Card, Company, Invoice, Order } from '@/database/entities';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MikroOrmModule.forFeature([Company, Card, Invoice, Order])],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService, CardService, JwtService],
})
export class PaymentModule {}
