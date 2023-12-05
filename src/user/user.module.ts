import { Company, User } from '@/database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MinioService } from '@/minio/minio.service';

@Module({
  imports: [MikroOrmModule.forFeature([Company, User]), HttpModule],
  controllers: [UserController],
  providers: [UserService, JwtService, MinioService],
})
export class UserModule {}
