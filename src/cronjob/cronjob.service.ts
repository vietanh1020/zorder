import { Injectable, Logger } from '@nestjs/common';
import * as cron from 'node-cron';

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);

  // Schedule a cron job to run every minute
  startCronJob(): void {
    cron.schedule('* * * * *', () => {
      console.log("RUN RUNNNNNNN")

      this.logger.debug('Cron job is running...');
      // Add your logic here, e.g., call a function or perform a task
    });
  }
}
