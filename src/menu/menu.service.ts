import { Menu } from '@/database/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: EntityRepository<Menu>,
    private entityManager: EntityManager,
  ) {}

  // getMenu(companyId): string {
  //   return 'Hello World!';
  // }

  async getMenu(companyId: string) {
    const list = this.menuRepository.find({ companyId });
    return list;
  }

  async createFood(food: CreateFoodDto, companyId: string) {
    const { name } = food;

    const menu: Menu = await this.menuRepository.findOne({
      name,
      companyId,
    });

    if (menu) {
      throw new BadRequestException(['food name already existed']);
    }

    const createFood = this.menuRepository.create({
      ...food,
      companyId,
    });

    await this.menuRepository.persistAndFlush(createFood);
    return createFood;
  }
}
