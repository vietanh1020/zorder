import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Mail } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('emailSending')
export class EmailProcessor {
  constructor(private readonly mailService: MailerService) {}

  @Process('welcome')
  async sendWelcomeEmail(job: Job<Mail>) {
    const { data } = job;

    await this.mailService.sendMail({
      to: data.email,
      from: 'vak63.uet.vnu@gmail.com',
      subject: 'Khôi phục mật khẩu Zorder',
      text: 'Bạn nhận được email khôi phục mật khẩu',
      html: '<b>Khôi phục mật khẩu Zorder</b>',
      context: {
        user: 'anhvv',
      },
    });
  }

  @Process('reset-password')
  async sendResetPasswordEmail(job: Job<Mail>) {
    const { data } = job;

    try {
      await this.mailService.sendMail({
        to: data.email,
        from: 'vak63.uet.vnu@gmail.com',
        subject: 'Khôi phục mật khẩu Zorder',
        text: 'Bạn nhận được email khôi phục mật khẩu',
        html: '<b>Khôi phục mật khẩu Zorder</b>',
      });
    } catch (error) {
      console.log(error);
    }
  }
}
