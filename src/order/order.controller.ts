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
import { AuthGuard, OwnerGuard } from '@/common/guards';
import { JwtUser } from '@/common/decorators';

@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() order: CreateOrderDto) {
    return await this.orderService.createOrder(order);
  }

  @Put('/cancel/:id')
  async cancelFoodOrder(@Param('id') id: string) {
    return await this.orderService.cancelOrder(id);
  }

  @Put('/status/:id')
  @UseGuards(AuthGuard)
  async change(
    @Param('id') id: string,
    @Body() { status = 1, device }: any,
    @JwtUser('company_id') company: string,
  ) {
    return await this.orderService.updateStatusFood(
      id,
      company,
      status,
      device,
    );
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
    const { status = 0, date = '', tableId } = queries;
    return await this.orderService.companyGetOrder(
      company_id,
      +status,
      date,
      tableId,
    );
  }

  @Get('')
  @UseGuards(AuthGuard)
  async companyGetOrderHistory(
    @JwtUser('company_id') company_id: string,
    @Query() queries,
  ) {
    const { status, date = '', tableId } = queries;
    return await this.orderService.companyGetOrderHistory(
      company_id,
      status,
      date,
      tableId,
    );
  }

  @Get('/month/statistics')
  @UseGuards(OwnerGuard)
  async statistics(
    @JwtUser('company_id') company_id: string,
    @Query() queries,
  ) {
    return await this.orderService.getDailyReport(company_id);
  }

  @Get('/monthly/food/statistics')
  @UseGuards(OwnerGuard)
  async monthyFood(
    @JwtUser('company_id') company_id: string,
    @Query() queries,
  ) {
    return await this.orderService.getMonthlyFoodReport(company_id);
  }

  @Get('/daily/food/statistics')
  @UseGuards(OwnerGuard)
  async dailyFood(@JwtUser('company_id') company_id: string, @Query() queries) {
    const { date = '' } = queries;
    return await this.orderService.getDailyFoodReport(date, company_id);
  }

  @Put('/end-table/:table')
  @UseGuards(AuthGuard)
  async endTable(
    @Param('table') table: string,
    @JwtUser('company_id') company_id: string,
  ) {
    return await this.orderService.endTable(table, company_id);
  }

  @Get('/year/statistics')
  @UseGuards(OwnerGuard)
  async yearStatistics(@JwtUser('company_id') company_id: string) {
    return await this.orderService.getMonthReport(company_id);
  }

  @Get('/customer/:id')
  async customerGetOrder(@Param('id') id: string) {
    return await this.orderService.customerGetOrder(id);
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
