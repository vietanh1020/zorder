import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controler';
import { JwtService } from '@nestjs/jwt';
import { Food, FoodOption } from '@/database/entities';

@Module({
  imports: [MikroOrmModule.forFeature([Food, FoodOption])],
  controllers: [MenuController],
  providers: [MenuService, JwtService],
})
export class MenuModule {}
