import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtUser } from '@/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { JwtDecoded } from '@/types';
import { CompanyDto } from './dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getCompany(@JwtUser('company_id') companyId: string) {
    return this.companyService.getCompany(companyId);
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateCompany(
    @JwtUser() user: JwtDecoded,
    @Body() updateCompany: CompanyDto,
  ) {
    const { company_id, role } = user;

    return this.companyService.updateCompany(company_id, role, updateCompany);
  }
}
