import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FoodDto } from './dto';
import { MenuService } from './menu.service';
import { AuthGuard } from '@/common/guards';
import { JwtUser } from '@/common/decorators';

@Controller('/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

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
  async updateFood(@Param('id') id: string, @Body() foodDto: FoodDto) {
    return this.menuService.updateFood(id, foodDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteFood(@Param('id') id: string) {
    return this.menuService.deleteFood(id);
  }
}
