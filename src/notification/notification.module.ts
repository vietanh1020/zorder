import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Company } from '@/database/entities';
import { NotificationService } from './notification.service';

@Module({
  imports: [MikroOrmModule.forFeature([Company])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
