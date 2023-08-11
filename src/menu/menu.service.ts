import { Food, FoodOption } from '@/database/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: EntityRepository<Food>,
    @InjectRepository(FoodOption)
    private readonly optionRepository: EntityRepository<FoodOption>,
    private entityManager: EntityManager,
  ) {}

  async getMenu(companyId: string) {
    const qb = this.entityManager.createQueryBuilder(
      'SELECT * FROM public.food',
    );

    console.log(qb);

    // const listFood = await this.foodRepository.find({ companyId });

    // const data = listFood.map(async (food) => {
    //   const listOption = await this.optionRepository.find({ foodId: food.id });

    //   console.log(listOption);

    //   return {
    //     ...food,
    //     listOption: listOption,
    //   };
    // });

    // console.log({ data });

    return qb;
  }

  async createFood(food: CreateFoodDto, companyId: string) {
    const { name } = food;

    const menu: Food = await this.foodRepository.findOne({
      name,
      companyId,
    });

    if (menu) {
      throw new BadRequestException(['food name already existed']);
    }

    const createFood = this.foodRepository.create({
      ...food,
      companyId,
    });

    const ListCreateOption = [];

    await this.foodRepository.persistAndFlush(createFood);

    food.foodOption.forEach(async (foodOption) => {
      try {
        const createOption = this.optionRepository.create({
          ...foodOption,
          foodId: createFood.id,
        });

        ListCreateOption.push(foodOption);

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
}
