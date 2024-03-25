import { NotificationService } from '@/notification/notification.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Device, Food, FoodOption, Order } from '@/database/entities';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MenuService } from '@/menu/menu.service';
import { FunctionOrder } from './order.func';
import { BullModule } from '@nestjs/bull';
import { OrderProcessor } from './order.processor';

@Module({
  imports: [
    MikroOrmModule.forFeature([Device, Order, Food, FoodOption]),
    BullModule.registerQueue({
      name: 'order',
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    MenuService,
    NotificationService,
    OrderProcessor,
    JwtService,
    FunctionOrder,
  ],
})
export class OrderModule {}
