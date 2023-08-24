import { Food, Order } from '@/database/entities';
import { MenuService } from '@/menu/menu.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,

    private readonly menuService: MenuService,
  ) {}

  async getOrder(id: string) {
    return await this.orderRepository.find({ id });
  }

  async createOrder(order: CreateOrderDto) {
    const { companyId, tableId, note } = order;
    let menu: any = await this.cacheManager.get('menu_' + companyId);
    if (!menu) {
      menu = await this.menuService.getMenu(companyId);
    }

    let total = 0;

    const foodReceipt = order.foods.map((foodBody) => {
      let price = 0;
      const foodDB: Food = menu.find((food: Food) => food.id === foodBody.id);
      price += foodDB.price;

      const FoodReceiptOption = foodBody.options.map((optionsBody) => {
        const optionDB = foodDB.options.find(
          (option) => option.id === optionsBody.id,
        );

        const detailOptionDb = optionDB.data.filter((detailOp) => {
          const result = optionsBody.data.find((option) => {
            return option.label === detailOp.label;
          });

          if (result) price += detailOp.price;

          return result;
        });

        return {
          label: optionDB.label,
          data: detailOptionDb,
        };
      });

      total += price;

      return {
        price,
        food: { ...foodDB, options: FoodReceiptOption },
      };
    });

    const createOrder = this.orderRepository.create({
      total,
      note,
      foods: foodReceipt,
      tableId,
      companyId,
    });

    await this.orderRepository.persistAndFlush(createOrder);

    return createOrder;
  }
}
