import { Body, Controller, Post, Req, Response } from '@nestjs/common';
import { CreateAdminDto, LoginDto } from './dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('/admin')
  async createAdmin(@Body() adminDto: CreateAdminDto, @Response() res) {
    const user = await this.userService.createAdmin(adminDto);

    res.cookie('token', user.accessToken, {
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

    res.cookie('token', user.accessToken, {
      expires: new Date(new Date().getTime() + 30 * 1000 * 3600),
      sameSite: 'strict',
      httpOnly: true,
    });

    return res.send(user);
  }
}
