import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MikroOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [OrderService, JwtService],
})
export class OrderModule {}
