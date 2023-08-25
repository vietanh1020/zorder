import { Food, Order } from '@/database/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

export class FunctionOrder {
  constructor(
    @InjectRepository(Order)
    private readonly usersRepository: EntityRepository<Order>,
    private entityManager: EntityManager,
  ) {}

  createNewOrder = async (order, menu) => {
    const repository = this.entityManager.fork().getRepository(Order);
    const { companyId, tableId, note } = order;

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

    const createOrder = repository.create({
      total,
      note,
      foods: foodReceipt,
      tableId,
      companyId,
    });

    await repository.persistAndFlush(createOrder);

    return createOrder;
  };
}
