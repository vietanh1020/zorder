import { BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { Food, Order } from '@/database/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

export class FunctionOrder {
  constructor(
    @InjectRepository(Order)
    private readonly usersRepository: EntityRepository<Order>,
    private entityManager: EntityManager,
  ) {}

  createNewOrder = async (order: CreateOrderDto, menu) => {
    const repository = this.entityManager.fork().getRepository(Order);
    const { companyId, tableId } = order;

    let total = 0;

    const foodReceipt = order.foods.map((foodBody) => {
      let price = 0;
      const foodDB: Food = menu.find((food: Food) => food.id === foodBody.id);
      if (!foodDB) throw new BadRequestException('Món ăn không tồn tại');
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

      total += price * foodBody.quantity;

      return {
        price: price * foodBody.quantity,
        quantity: foodBody.quantity,
        food: { ...foodDB, options: FoodReceiptOption },
      };
    });

    const createOrder = repository.create({
      total,
      foods: foodReceipt,
      tableId,
      companyId,
    });

    await repository.persistAndFlush(createOrder);

    return createOrder;
  };
}
