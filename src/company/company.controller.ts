import { JwtUser } from '@/common/decorators';
import { AuthGuard } from '@/common/guards';
import { JwtDecoded } from '@/types';
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyDto } from './dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getCompany(@JwtUser('company_id') companyId: string) {
    return this.companyService.getCompany(companyId);
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateCompany(
    @JwtUser() user: JwtDecoded,
    @Body() updateCompany: CompanyDto,
  ) {
    const { company_id, role } = user;

    return this.companyService.updateCompany(company_id, role, updateCompany);
  }
}
