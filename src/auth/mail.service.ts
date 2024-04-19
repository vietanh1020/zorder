import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

export interface Mail {
  [key: string]: any;
}

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('emailSending') private readonly emailQueue: Queue,
    private readonly mailService: MailerService,
  ) {}

  async sendWelcomeEmail(data: Mail) {
    const job = await this.emailQueue.add('welcome', { data });

    return { jobId: job.id };
  }

  async sendResetPasswordEmail(data: Mail) {
    const job = await this.emailQueue.add('reset-password', { data });

    const { domain = 'http://localhost:3000', email, token } = data;
    try {
      const send = {
        to: email,
        from: 'vak63.uet.vnu@gmail.com',
        subject: '[Zorder] Quên mật khẩu',
        text: 'Bạn nhận được email khôi phục mật khẩu',
        html: `<div>Đây là email phục mật khẩu Zorder. Liên kết này sẽ hết hạn trong 1h.
         Vui lòng click vào <a href="${domain}/forgot-password/${token}">link</a> để đăng nhập lại</div>`,
      };
      return await this.mailService.sendMail(send);
    } catch (error) {
      console.log(error);
    }

    return { jobId: job.id };
  }
}
