import { Food, Order, OrderDetail } from '@/database/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';

export class FunctionOrder {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: EntityRepository<Order>,

    @InjectRepository(OrderDetail)
    private readonly detailRepo: EntityRepository<OrderDetail>,
    private entityManager: EntityManager,
  ) {}

  saveOrderDetail = async (
    customerName: string,
    companyId: string,
    orderId: string,
    detail: string,
  ) => {
    const detailRepo = this.entityManager.fork().getRepository(OrderDetail);

    const createDetail = detailRepo.create({
      customerName,
      detail,
      companyId,
      orderId,
    });

    await detailRepo.persistAndFlush(createDetail);
    return createDetail;
  };

  createNewOrder = async (order: CreateOrderDto, menu) => {
    const orderRepo = this.entityManager.fork().getRepository(Order);

    const { companyId, tableId, deviceToken } = order;

    let total = 0;

    try {
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

        const data = {
          price: price * foodBody.quantity,
          quantity: foodBody.quantity,
          food: { ...foodDB, options: FoodReceiptOption },
        };

        return data;
      });

      const createOrder = orderRepo.create({
        total,
        foods: foodReceipt,
        tableId,
        companyId,
        deviceToken,
      });

      await orderRepo.persistAndFlush(createOrder);

      for (const food of createOrder.foods) {
        await this.saveOrderDetail(
          createOrder.customerName,
          companyId,
          createOrder.id,
          JSON.stringify(food.food),
        );
      }

      return createOrder;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  };
}
