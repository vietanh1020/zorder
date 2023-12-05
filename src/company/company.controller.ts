import { JwtUser } from '@/common/decorators';
import { AuthGuard, OwnerGuard } from '@/common/guards';
import { JwtDecoded } from '@/types';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from '@/minio/minio.service';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly minioService: MinioService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getCompany(@JwtUser('company_id') companyId: string) {
    return this.companyService.getCompany(companyId);
  }

  @UseGuards(OwnerGuard)
  @Post('/images')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBookCover(
    @UploadedFile() file: Express.Multer.File,
    @JwtUser('company_id') company: string,
  ) {
    const fileName = await this.minioService.uploadFile(
      file,
      'company/' + company,
    );
    return fileName;
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
