import { JwtUser } from '@/common/decorators';
import { OwnerGuard } from '@/common/guards';
import { JwtDecoded } from '@/types';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/card.dto';
import { PaymentService } from './payment.service';

@Controller('/payment')
export class PaymentController {
  constructor(
    private cardService: CardService,
    private paymentService: PaymentService,
  ) {}

  @Post('/card')
  @UseGuards(OwnerGuard)
  async create(@JwtUser() user: JwtDecoded, @Body() body: CreateCardDto) {
    return await this.cardService.create({
      email: user.email,
      companyId: user.company_id,
      ...body,
    });
  }

  @Get('/invoice')
  @UseGuards(OwnerGuard)
  async getInvoice(@JwtUser('company_id') company: string) {
    return await this.paymentService.getInvoices(company);
  }

  @Get('/block-trial')
  async checkCompanyTrial() {
    return await this.paymentService.blockTrial();
  }

  @Get('/cron-job')
  async cronJob() {
    return await this.paymentService.jobCreateInvoice();
  }

  @UseGuards(OwnerGuard)
  @Get('/card')
  async getListCard(@JwtUser('company_id') company: string) {
    return await this.cardService.getListCard(company);
  }

  @UseGuards(OwnerGuard)
  @Put('/:id')
  async manualCharge(@Param('id') id: string) {
    return await this.paymentService.manualCharge(id);
  }

  @UseGuards(OwnerGuard)
  @Put('/version')
  async upgradePayVersion(@JwtUser('company_id') company: string) {
    return await this.paymentService.upgradePayVersion(company);
  }

  @UseGuards(OwnerGuard)
  @Get('/card/:id')
  async getCard(@Param('id') id: string) {
    return await this.cardService.getCard(id);
  }
}
