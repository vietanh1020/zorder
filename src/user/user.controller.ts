import { JwtUser } from '@/common/decorators';
import { OwnerGuard } from '@/common/guards';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(OwnerGuard)
  @Get()
  async getUser(@JwtUser('company_id') company: string) {
    return await this.userService.getUser(company);
  }
}
