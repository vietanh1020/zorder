import { Module } from '@nestjs/common';

import { GoogleStrategy } from './google.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Company, User } from '@/database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Company, User])],
  controllers: [UserController],
  providers: [UserService, GoogleStrategy],
})
export class UserModule {}
