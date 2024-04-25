import { AuthGuard } from '@/common/guards';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import {
  ChangePassDto,
  CreateAdminDto,
  CreateStaffDto,
  DeviceTokenDto,
  LoginDto,
} from './dto';
import { AuthService } from './auth.service';
import { JwtUser } from '@/common/decorators';
import { MailService } from './mail.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('/admin')
  async createAdmin(@Body() adminDto: CreateAdminDto, @Response() res) {
    const user = await this.authService.createAdmin(adminDto);

    res.cookie('ztoken', user.accessToken, {
      expires: new Date(new Date().getTime() + 30 * 1000 * 3600),
      sameSite: 'strict',
      httpOnly: true,
    });

    return res.send(user);
  }

  @Get('/check-invalid-email')
  async checkEmail(@Body() body: { email: string }) {
    return await this.authService.checkEmail(body.email);
  }

  @Post('/forgot-password')
  async forgotPassword(
    @Body() body: { email: string; domain: string | undefined },
  ) {
    const token = await this.authService.forgotPassword(body.email);
    return await this.mailService.sendResetPasswordEmail({
      ...body,
      token,
    });
  }

  @Post('/change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() body: ChangePassDto,
    @JwtUser('id') userId: string,
  ) {
    return await this.authService.changePassword(body, userId);
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

  @Post('/device')
  @UseGuards(AuthGuard)
  async deviceToken(
    @Body() deviceDto: DeviceTokenDto,
    @JwtUser('company_id') company: string,
    @JwtUser('id') userId: string,
  ) {
    const data = await this.authService.saveDeviceToken(
      deviceDto,
      company,
      userId,
    );
    return data;
  }

  @Post('/login')
  async loginCredentials(@Body() loginDto: LoginDto, @Response() res) {
    const user = await this.authService.loginCredentials(loginDto);

    res.cookie('ztoken', user.accessToken, {
      expires: new Date(new Date().getTime() + 30 * 1000 * 3600),
      sameSite: 'strict',
      httpOnly: true,
    });

    return res.send(user);
  }

  @Post('/logout')
  async logout(@Body() { deviceToken }: { deviceToken: string | undefined }) {
    return await this.authService.logout(deviceToken);
  }
}
