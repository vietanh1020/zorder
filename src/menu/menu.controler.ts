import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateFoodDto } from './dto';
import { MenuService } from './menu.service';

@Controller('/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenu() {
    const companyId = '1231381830138083018301';
    return this.menuService.getMenu(companyId);
  }

  @Post()
  async createFood(@Body() foodDto: CreateFoodDto) {
    console.log({ foodDto });

    return this.menuService.createFood(foodDto, '1231381830138083018301');
  }
}
