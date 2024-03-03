import { AuthGuard } from '@/common/guards';
import {
  Body,
  Controller,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CreateAdminDto, CreateStaffDto, LoginDto } from './dto';
import { AuthService } from './auth.service';
import { JwtUser } from '@/common/decorators';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/admin')
  async createAdmin(@Body() adminDto: CreateAdminDto, @Response() res) {
    const user = await this.authService.createAdmin(adminDto);

    res.cookie('token', user.accessToken, {
      expires: new Date(new Date().getTime() + 30 * 1000 * 3600),
      sameSite: 'strict',
      httpOnly: true,
    });

    return res.send(user);
  }

  @Post('/google')
  async googleAuth(@Req() req, @Body() body) {
    const user = await this.authService.loginGoogle(body.token);
    return user;
  }

  @Post('/staff')
  @UseGuards(AuthGuard)
  async inviteStaff(
    @Body() staffDto: CreateStaffDto,
    @JwtUser('company_id') company: string,
  ) {
    const data = await this.authService.inviteStaff(staffDto, company);
    return data;
  }

  @Post('/login')
  async loginCredentials(@Body() loginDto: LoginDto, @Response() res) {
    const user = await this.authService.loginCredentials(loginDto);

    res.cookie('token', user.accessToken, {
      expires: new Date(new Date().getTime() + 30 * 1000 * 3600),
      sameSite: 'strict',
      httpOnly: true,
    });

    return res.send(user);
  }
}
