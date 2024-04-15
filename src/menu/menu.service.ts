import { Category, Food, FoodOption } from '@/database/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FoodDto, FoodUpdateDto } from './dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CategoryDto } from '@/category/dto/category.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: EntityRepository<Food>,

    @InjectRepository(Category)
    private readonly cateRepo: EntityRepository<Category>,

    @InjectRepository(FoodOption)
    private readonly optionRepository: EntityRepository<FoodOption>,
    private entityManager: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getMenu(companyId: string, search = '') {
    let isBlock = await this.cacheManager.get('blocked:' + companyId);
    if (!!isBlock)
      throw new BadRequestException(
        'Dịch vụ bị block bởi vì cửa hàng chưa thanh toán',
      );
    let menu: any = await this.cacheManager.get('menu_' + companyId);

    if (!menu) {
      menu = await this.foodRepository.find(
        { companyId },
        { populate: ['options'] },
      );

      await this.cacheManager.set('menu_' + companyId, menu);
    }

    const newMenu: any = menu.filter((item) => {
      return item.name.toLowerCase().includes(search.toLowerCase());
    });

    const groupedFoods = newMenu.reduce((acc, food) => {
      if (!acc[food.category]) {
        acc[food.category] = [];
      }
      acc[food.category].push(food);
      return acc;
    }, {});

    return groupedFoods;
  }

  async getAllFood(companyId: string, search = '') {
    let menu: any = await this.cacheManager.get('all_food_' + companyId);

    if (!menu) {
      menu = await this.foodRepository.find({ companyId });

      await this.cacheManager.set('all_food_' + companyId, menu);
    }

    const newMenu: any = menu.filter((item) => {
      return item.name.toLowerCase().includes(search.toLowerCase());
    });

    return newMenu;
  }

  async userGetMenu(companyId: string, search = '') {
    let isBlock = await this.cacheManager.get('blocked:' + companyId);
    if (!!isBlock)
      throw new BadRequestException(
        'Dịch vụ bị block bởi vì cửa hàng chưa thanh toán',
      );
    let menu: any = await this.cacheManager.get('menu_' + companyId);

    if (!menu) {
      menu = await this.foodRepository.find(
        { companyId },
        { populate: ['options'] },
      );

      await this.cacheManager.set('menu_' + companyId, menu);
    }

    const newMenu: any = menu.filter((item) => {
      return item.name.toLowerCase().includes(search.toLowerCase());
    });

    const groupedFoods = newMenu.reduce((acc, food) => {
      if (!acc[food.category]) {
        acc[food.category] = [];
      }
      acc[food.category].push(food);
      return acc;
    }, {});

    return groupedFoods;
  }

  async createFood(food: FoodDto, companyId: string) {
    const { name } = food;

    const menu: Food = await this.foodRepository.findOne({
      name,
      companyId,
    });

    if (menu) {
      throw new BadRequestException(['food name already existed']);
    }

    await this.cacheManager.del('menu_' + companyId);

    const createFood = this.foodRepository.create({
      ...food,
      companyId,
    });

    const ListCreateOption = [];

    await this.foodRepository.persistAndFlush(createFood);

    food.foodOption.forEach(async (foodOption) => {
      try {
        // const option = await this.optionRepository.findOne({
        //   foodId: createFood.id,
        //   label: foodOption.label,
        // });

        // if (option) return `${foodOption.label} bị trùng!`;

        const createOption = this.optionRepository.create({
          ...foodOption,
          foodId: createFood.id,
        });

        ListCreateOption.push(createOption);
        await this.optionRepository.persistAndFlush(createOption);
      } catch (error) {
        throw new BadRequestException(
          'Error create option ' + foodOption.label,
        );
      }
    });

    return {
      ...createFood,
      listOption: ListCreateOption,
    };
  }

  async updateFood(id: string, companyId: string, updateFood: FoodUpdateDto) {
    const food = await this.foodRepository.findOne({ id, companyId });

    if (!food) {
      throw new NotFoundException(`Food with ID ${id} not found`);
    }

    this.foodRepository.assign(food, updateFood);

    await this.foodRepository.persistAndFlush(food);

    // for (const option of food.options) {
    //   await this.optionRepository.removeAndFlush(option);
    // }

    // for (const option of updateFood.foodOption) {
    //   try {
    //     const createOption = this.optionRepository.create({
    //       ...option,
    //       foodId: food.id,
    //     });

    //     await this.optionRepository.persistAndFlush(createOption);
    //   } catch (error) {
    //     throw new BadRequestException('Error create option ' + option.label);
    //   }
    // }

    await this.cacheManager.del('menu_' + food.companyId);

    return food;
  }

  async deleteFood(id: string, companyId: string) {
    const food = await this.foodRepository.findOne(
      {
        id,
        companyId,
      },
      { populate: ['options'] },
    );

    if (!food) {
      throw new BadRequestException(['food name not existed']);
    }

    await this.foodRepository.removeAndFlush(food);

    await this.cacheManager.del('menu_' + food.companyId);

    return food;
  }
}
