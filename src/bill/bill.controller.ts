import { JwtUser } from '@/common/decorators';
import { AuthGuard } from '@/common/guards';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BillService } from './bill.service';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@JwtUser('company_id') companyId: string) {
    return this.billService.findAll(companyId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.billService.findOne(id);
  }
}
