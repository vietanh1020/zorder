import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cron from 'node-cron';

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);

  // Schedule a cron job to run every minute
  startCronJob(): void {
    cron.schedule('* * * * *', async () => {
      // 10 min/ 1 LAN
      const { data } = await axios.get(
        'http://localhost:3003/payment/cron-job',
      );

      this.logger.debug('GET FEE USED', data);
    });

    cron.schedule('0 0 * * *', async () => {
      // 1 DAY / 1 LAN
      const { data } = await axios.get(
        'http://localhost:3003/payment/block-trial',
      );

      this.logger.debug('BLOCK COMPANY TRIAL', data);
    });
  }
}
