import { Company } from '@/database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { MinioService } from '@/minio/minio.service';

@Module({
  imports: [MikroOrmModule.forFeature([Company])],
  controllers: [CompanyController],
  providers: [CompanyService, JwtService, MinioService],
})
export class CompanyModule {}
