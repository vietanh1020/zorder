import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateFoodDto } from './dto';
import { MenuService } from './menu.service';
import { AuthGuard } from '@/common/guards';
import { JwtUser } from '@/common/decorators';

@Controller('/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get(':id')
  async getMenu(@Param() companyId: string) {
    return this.menuService.getMenu(companyId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createFood(
    @Body() foodDto: CreateFoodDto,
    @JwtUser('company_id') companyId: string,
  ) {
    return this.menuService.createFood(foodDto, companyId);
  }
}
