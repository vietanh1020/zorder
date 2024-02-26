import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from './dto';
import { OrderService } from './order.service';
import { AuthGuard } from '@/common/guards';
import { JwtUser } from '@/common/decorators';

@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() order: CreateOrderDto) {
    return await this.orderService.createOrder(order);
  }

  @Put('/cancel/:id')
  @UseGuards(AuthGuard)
  async cancelOrder(
    @Param('id') id: string,
    @JwtUser('company_id') company: string,
  ) {
    return await this.orderService.cancelOrder(id, company);
  }

  @Put('/approve/:id')
  @UseGuards(AuthGuard)
  async approveOrder(
    @Param('id') id: string,
    @JwtUser('company_id') company: string,
  ) {
    return await this.orderService.approveOrder(id, company);
  }

  @Put('/end/:id')
  @UseGuards(AuthGuard)
  async end(@Param('id') id: string, @JwtUser('company_id') company: string) {
    return await this.orderService.endOrder(id, company);
  }

  @Get('')
  @UseGuards(AuthGuard)
  async companyGetOrder(
    @JwtUser('company_id') company_id: string,
    @Query() queries,
  ) {
    const { status = 0, date = '' } = queries;
    return await this.orderService.companyGetOrder(company_id, +status, date);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async userGetOrder(
    @JwtUser('company_id') company_id: string,
    @Param('id') id: string,
  ) {
    return await this.orderService.getOrderDetails(id, company_id);
  }
}
