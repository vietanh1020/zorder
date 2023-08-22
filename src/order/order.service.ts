import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class OrderService {
  constructor(@InjectQueue('order') private readonly orderQueue: Queue) {}

  async sendWelcomeEmail(data: Order) {
    const job = await this.orderQueue.add('order', { data });

    return { jobId: job.id };
  }
}
