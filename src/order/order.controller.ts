import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

  @Get('')
  @UseGuards(AuthGuard)
  async companyGetOrder(
    @JwtUser('company_id') company_id: string,
    @Query() queries,
  ) {
    const { status = '', date = '' } = queries;
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
