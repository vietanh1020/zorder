import { Food, FoodOption } from '@/database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MinioService } from '@/minio/minio.service';

@Module({
  imports: [MikroOrmModule.forFeature([Food, FoodOption])],
  controllers: [MenuController],
  providers: [MenuService, JwtService, MinioService],
})
export class MenuModule {}
