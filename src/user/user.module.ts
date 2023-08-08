import { Module } from '@nestjs/common';

import { GoogleStrategy } from './google.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, GoogleStrategy],
})
export class UserModule {}
