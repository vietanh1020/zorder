import { Controller } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly chatService: ChatService) {}

  //   @UseGuards(AuthGuard)
  //   @Get()
  //   async getCompany(@JwtUser('company_id') companyId: string) {
  //     return this.chatService.getCompany(companyId);
  //   }
}
