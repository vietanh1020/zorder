import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateAdminDto, LoginDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/admin')
  async createAdmin(@Body() adminDto: CreateAdminDto, @Response() res) {
    const user = await this.userService.createAdmin(adminDto);

    res.cookie('access_token', user.accessToken, {
      expires: new Date(new Date().getTime() + 30 * 1000 * 3600),
      sameSite: 'strict',
      httpOnly: true,
    });

    return res.send(user);
  }

  @Post('/google')
  async googleAuth(@Req() req, @Body() body) {
    const user = await this.userService.loginGoogle(body.token);
    return user;
  }

  @Post('/login')
  async loginCredentials(@Body() loginDto: LoginDto, @Response() res) {
    const user = await this.userService.loginCredentials(loginDto);

    res.cookie('access_token', user.accessToken, {
      expires: new Date(new Date().getTime() + 30 * 1000 * 3600),
      sameSite: 'strict',
      httpOnly: true,
    });

    return res.send(user);
  }
}
