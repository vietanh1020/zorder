import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Menu } from '../database/entities/menu.entity';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controler';

@Module({
  imports: [MikroOrmModule.forFeature([Menu])],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
