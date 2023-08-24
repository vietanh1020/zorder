import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Food, FoodOption, Order } from '@/database/entities';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MenuService } from '@/menu/menu.service';

@Module({
  imports: [MikroOrmModule.forFeature([Order, Food, FoodOption])],
  controllers: [OrderController],
  providers: [OrderService, MenuService, JwtService],
})
export class OrderModule {}
