import { Category } from '@/database/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly cateRepo: EntityRepository<Category>,
  ) {}

  async getCategory(companyId: string) {
    return await this.cateRepo.find({ companyId });
  }

  async createCategory(category: CategoryDto, companyId: string) {
    const { name } = category;

    const menu: Category = await this.cateRepo.findOne({
      name,
      companyId,
    });

    if (menu) {
      throw new BadRequestException(['Category name already existed']);
    }

    const createFood = this.cateRepo.create({
      ...category,
      companyId,
    });

    await this.cateRepo.persistAndFlush(createFood);

    return;
  }
}
