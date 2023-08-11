import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Menu } from '../database/entities/menu.entity';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controler';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MikroOrmModule.forFeature([Menu])],
  controllers: [MenuController],
  providers: [MenuService, JwtService],
})
export class MenuModule {}
