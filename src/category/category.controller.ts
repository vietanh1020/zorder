import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { AuthGuard } from '@/common/guards';
import { JwtUser } from '@/common/decorators';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCategory(
    @Body() categoryDto: CategoryDto,
    @JwtUser('company_id') companyId: string,
  ) {
    return this.categoryService.createCategory(categoryDto, companyId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getCategory(@JwtUser('company_id') companyId: string) {
    return this.categoryService.getCategory(companyId);
  }

  @Get(':id')
  async userGetCategory(@Param('id') companyId: string) {
    return this.categoryService.getCategory(companyId);
  }
}
