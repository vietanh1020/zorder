import { Module } from '@nestjs/common';
import { Company, Device, User } from '@/database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MikroOrmModule.forFeature([Company, User, Device]),
    HttpModule,
    BullModule.registerQueue({
      name: 'emailSending',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, MailService],
})
export class AuthModule {}
