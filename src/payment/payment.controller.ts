import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { IsAdminGuard } from 'src/guard/is-admin.guard';
import { ApiSuccessResponse } from '../../share/api-response';
import { CardService } from './card.service';
import { PaymentService } from './payment.service';

@Controller('api/v1/payment')
export class PaymentController {
  constructor(
    private cardService: CardService,
    private paymentService: PaymentService,
  ) {}

  @Post('/card')
  @UseGuards(IsAdminGuard)
  async create(@Res() res: Response, @Req() { user }, @Body() body) {
    return res.send(
      ApiSuccessResponse.create(
        await this.cardService.create({
          email: user.email,
          company: user.company,
          ...body,
        }),
      ),
    );
  }

  @Get('/invoice')
  @UseGuards(IsAdminGuard)
  async getInvoice(@Res() res: Response, @Req() { user }) {
    return res.send(
      ApiSuccessResponse.create(
        await this.paymentService.getInvoices(user.company),
      ),
    );
  }

  @Get('/block-trial')
  async checkCompanyTrial(@Res() res: Response) {
    return res.send(
      ApiSuccessResponse.create(await this.paymentService.blockCompanyTrial()),
    );
  }

  @Get('/cron-job')
  async cronJob(@Res() res: Response) {
    return res.send(
      ApiSuccessResponse.create(await this.paymentService.jobCreateInvoice()),
    );
  }

  @UseGuards(IsAdminGuard)
  @Get('/cards')
  async getListCard(@Res() res: Response, @Req() { user }) {
    return res.send(
      ApiSuccessResponse.create(
        await this.cardService.getListCard(user.company),
      ),
    );
  }

  @UseGuards(IsAdminGuard)
  @Put('/:id')
  async manualCharge(@Res() res: Response, @Param('id') id: string) {
    return res.send(
      ApiSuccessResponse.create(await this.paymentService.manualCharge(id)),
    );
  }

  @UseGuards(IsAdminGuard)
  @Put('/version')
  async upgradePayVersion(@Res() res: Response, @Req() { user }) {
    return res.send(
      ApiSuccessResponse.create(
        await this.paymentService.upgradePayVersion(user.company),
      ),
    );
  }

  @UseGuards(IsAdminGuard)
  @Get('/card/:id')
  async getCard(@Res() res: Response, @Param('id') id: string) {
    return res.send(
      ApiSuccessResponse.create(await this.cardService.getCard(id)),
    );
  }
}
