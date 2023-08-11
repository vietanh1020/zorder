import { Module } from '@nestjs/common';

import { Company, User } from '@/database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtService } from '@nestjs/jwt';
import { GoogleStrategy } from './google.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature([Company, User])],
  controllers: [UserController],
  providers: [UserService, GoogleStrategy, JwtService],
})
export class UserModule {}
