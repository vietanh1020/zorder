import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FoodDto } from './dto';
import { MenuService } from './menu.service';
import { AuthGuard, OwnerGuard } from '@/common/guards';
import { JwtUser } from '@/common/decorators';
import { MinioService } from '@/minio/minio.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly minioService: MinioService,
  ) {}

  @UseGuards(OwnerGuard)
  @Post('/images')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBookCover(
    @UploadedFile() file: Express.Multer.File,
    @JwtUser('company_id') company: string,
  ) {
    const fileName = await this.minioService.uploadFile(
      file,
      'menu/' + company,
    );
    return fileName;
  }

  @Get()
  @UseGuards(AuthGuard)
  async adminGetMenu(@JwtUser('company_id') companyId: string) {
    return this.menuService.getMenu(companyId);
  }

  @Get(':id')
  async getMenu(@Param('id') companyId: string) {
    return this.menuService.getMenu(companyId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createFood(
    @Body() foodDto: FoodDto,
    @JwtUser('company_id') companyId: string,
  ) {
    return this.menuService.createFood(foodDto, companyId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateFood(
    @Param('id') id: string,
    @JwtUser('company_id') companyId: string,
    @Body() foodDto: FoodDto,
  ) {
    return this.menuService.updateFood(id, companyId, foodDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteFood(
    @Param('id') id: string,
    @JwtUser('company_id') companyId: string,
  ) {
    return this.menuService.deleteFood(id, companyId);
  }
}
