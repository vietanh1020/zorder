import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async updateFood() {
    const token =
      'deLQqeU5Izfi82frcpeEKw:APA91bErz3Z3fNam_Jt9QlvqWlgnTYBNGgE31AjV_wd7RIxApQ1MbAX0aNM5q4Ly9HN5zxAFj7NLp1P3-kbLFqbQfEKFkMth6BgxymSq2df7uDF-2szBU5KSxKLH1cRSbsY1vDqmQU2j';
    return this.notificationService.sendNotify(
      token,
      'order',
      'company have order',
    );
  }
}
