import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

export interface Mail {
  from: string;
  to: string;
  subject: string;
  text: string;
  [key: string]: any;
}

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('emailSending') private readonly emailQueue: Queue,
  ) {}

  async sendWelcomeEmail(data: Mail) {
    const job = await this.emailQueue.add('welcome', { data });

    return { jobId: job.id };
  }

  async sendResetPasswordEmail(data: Mail) {
    const job = await this.emailQueue.add('reset-password', { data });

    return { jobId: job.id };
  }
}
