import { Order, OrderDetail } from '@/database/entities';
import { MenuService } from '@/menu/menu.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectQueue } from '@nestjs/bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';
import * as moment from 'moment';
import { CreateOrderDto } from './dto';
import { FunctionOrder } from './order.func';
import { EntityManager } from '@mikro-orm/core';
import { NotificationService } from '@/notification/notification.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('order') private readonly orderQueue: Queue,

    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
    @InjectRepository(OrderDetail)
    private readonly detailRepo: EntityRepository<OrderDetail>,
    private readonly menuService: MenuService,
    private readonly notiService: NotificationService,
    private readonly functionOrder: FunctionOrder,
    private readonly em: EntityManager,
  ) {}

  async companyGetOrder(
    companyId: string,
    status = 0,
    date = new Date(),
    tableId = '',
  ) {
    // let isBlock = await this.cacheManager.get('blocked:' + companyId);
    // if (!!isBlock)
    //   throw new BadRequestException(
    //     'Dịch vụ bị block bởi vì cửa hàng chưa thanh toán',
    //   );

    let query: any = {};

    query.status = status;

    if (!!tableId) query.tableId = tableId;

    query.createdAt = {
      $gte: moment().startOf('date').toDate(),
      $lt: new Date(),
    };

    const data = await this.orderRepository.find({
      companyId,
      ...query,
    });

    const detailList = data.map(async (item) => {
      const details = await this.detailRepo.find({ orderId: item.id });

      return {
        ...item,
        details,
      };
    });

    return await Promise.all(detailList);
  }

  async companyGetOrderHistory(
    companyId: string,
    status = 0,
    date = new Date(),
    tableId = '',
  ) {
    // let isBlock = await this.cacheManager.get('blocked:' + companyId);
    // if (!!isBlock)
    //   throw new BadRequestException(
    //     'Dịch vụ bị block bởi vì cửa hàng chưa thanh toán',
    //   );

    let query: any = {};

    if (!!tableId) query.tableId = tableId;

    query.createdAt = {
      $gte: moment().startOf('date').toDate(),
      $lt: new Date(),
    };

    const data = await this.orderRepository.find(
      {
        companyId,
        ...query,
      },
      { orderBy: { createdAt: 'DESC' } },
    );

    const detailList = data.map(async (item) => {
      const details = await this.detailRepo.find({ orderId: item.id });

      return {
        ...item,
        details,
      };
    });

    return await Promise.all(detailList);
  }

  async cancelOrder(id: string) {
    const orderDetail = await this.detailRepo.findOne({ id });

    if (orderDetail.status !== 0)
      throw new BadRequestException(
        `Cửa hàng đã chuẩn bị món cho bạn không thể hủy`,
      );
    this.detailRepo.assign(orderDetail, { status: -1 });
    await this.detailRepo.persistAndFlush(orderDetail);
    await this.notiService.sendNotify(orderDetail.companyId);
    return orderDetail;
  }

  async approveOrder(id: string, companyId: string) {
    const order = await this.orderRepository.findOne({ id, companyId });

    if (!order) throw new NotFoundException(`Order with not found`);
    if (order.status === 2)
      throw new BadRequestException(
        'Order đã kết thúc không thể chuyển trạng thái',
      );

    this.orderRepository.assign(order, { status: 1 });

    await this.orderRepository.persistAndFlush(order);

    return order;
  }

  async updateStatusFood(
    id: string,
    companyId: string,
    status: number,
    deviceToken: string,
  ) {
    const orderDetail = await this.detailRepo.findOne({ id, companyId });

    if (!orderDetail) throw new NotFoundException(`Order not found`);
    this.detailRepo.assign(orderDetail, { status });
    await this.detailRepo.persistAndFlush(orderDetail);
    await this.notiService.sendNotiCustomer(deviceToken);
    return orderDetail;
  }

  async endOrder(id: string, companyId: string) {
    const order = await this.orderRepository.findOne({ id, companyId });

    if (!order) throw new NotFoundException(`Order with not found`);

    this.orderRepository.assign(order, { status: 2 });

    await this.orderRepository.persistAndFlush(order);
    return order;
  }

  async endTable(tableId: string, companyId: string) {
    await this.cacheManager.del(`block_${companyId}_${tableId}`);
    let query: any = {};
    const date = new Date();
    query.createdAt = {
      $gte: moment(date).startOf('date').toDate(),
      $lt: moment(date).endOf('date').toDate(),
    };

    const orders = await this.orderRepository.find({
      tableId,
      companyId,
      ...query,
      status: 0,
    });

    for (let order of orders) {
      this.orderRepository.assign(order, { status: 2 });
      await this.orderRepository.persistAndFlush(order);

      const details = await this.detailRepo.find({ orderId: order.id });
      for (let detail of details) {
        this.detailRepo.assign(detail, { status: 2, updatedAt: date });
        await this.detailRepo.persistAndFlush(detail);
      }
    }

    return orders.map((orders) => orders.id);
  }

  async getOrderDetails(id: string, companyId: string) {
    let isBlock = await this.cacheManager.get('blocked:' + companyId);
    if (!!isBlock)
      throw new BadRequestException(
        'Dịch vụ bị block bởi vì cửa hàng chưa thanh toán',
      );

    const order = await this.detailRepo.find({ orderId: id });
    return order;
  }

  async customerGetOrder(ids: string) {
    const idArr = ids.split('+');
    const detail = await this.detailRepo.find({ orderId: { $in: idArr } });

    return detail.sort();
  }

  async createOrder(order: CreateOrderDto) {
    const { companyId, tableId, deviceToken } = order;
    const menu: any = await this.menuService.getAllFood(companyId);

    let isBlockTable = await this.cacheManager.get(
      `block_${companyId}_${tableId}`,
    );

    if (!!isBlockTable && deviceToken !== isBlockTable)
      throw new BadRequestException(
        'Bàn này đang được phục vụ. Vui lòng chọn bàn khác hoặc liên hệ nhân viên',
      );

    if (!isBlockTable && deviceToken) {
      await this.cacheManager.set(
        `block_${companyId}_${tableId}`,
        deviceToken,
        3 * 60 * 60 * 1000,
      );
    }

    await this.notiService.sendNotify(order.companyId);
    return await this.functionOrder.createNewOrder(order, menu);
  }

  // get statistics sl order trong thang
  async getDailyReport(companyId: string): Promise<any[]> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const rawQuery = `
      SELECT DATE(o.created_at), SUM(o.total_money) , count(*)
      FROM
        "order" o
      WHERE
        EXTRACT(YEAR FROM o.created_at) = ? AND
        EXTRACT(MONTH FROM o.created_at) = ? AND
        o.company_id = ?
      GROUP BY 
        DATE(o.created_at)
    `;

    const order = await this.em
      .getConnection()
      .execute(rawQuery, [year, month, companyId]);

    return order;
  }

  async getMonthlyFoodReport(companyId: string): Promise<any[]> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const menu: any = await this.menuService.getAllFood(companyId);
    const foodIds = menu.map((item) => item.id);

    if (menu?.length === 0) return menu;

    const rawQuery = `SELECT o.foods
    FROM "order" o 
    WHERE  o.company_id = ? AND 
      EXTRACT(MONTH FROM o.created_at) = ? AND
      EXTRACT(YEAR FROM o.created_at) = ?
    `;

    const statistic: any = {};
    // menu.forEach((element) => {
    //   const { name } = element;
    //   statistic[element.id] = { name, count: 0 };
    // });

    const orders = await this.em
      .getConnection()
      .execute(rawQuery, [companyId, month, year]);

    const foodInOder = orders
      .map(({ foods }) => {
        return foods;
      })
      .flat();

    foodInOder.map(({ food, quantity }) => {
      statistic[food.id] = { name: food.name, count: 0 };
      return (statistic[food.id].count += quantity);
    });

    return statistic;
  }

  async getDailyFoodReport(date: string, companyId: string): Promise<any[]> {
    const day = date || moment().format('YYYY-MM-DD');

    const menu: any = await this.menuService.getAllFood(companyId);

    if (menu?.length === 0) return menu;

    const rawQuery = `SELECT o.foods FROM "order" o WHERE  o.company_id = ? AND DATE(o.created_at) = ? `;

    const statistic: any = {};
    menu.forEach((element) => {
      const { name } = element;
      statistic[element.id] = { name, count: 0 };
    });

    const orders = await this.em
      .getConnection()
      .execute(rawQuery, [companyId, day]);

    const foodInOder = orders
      .map(({ foods }) => {
        return foods;
      })
      .flat();

    foodInOder.map(({ food, quantity }) => {
      return (statistic[food.id].count += quantity);
    });

    return statistic;
  }

  async getMonthReport(companyId: string): Promise<any[]> {
    const now = new Date();
    const year = now.getFullYear();

    const rawQuery = `
      SELECT EXTRACT(MONTH FROM o.created_at), SUM(o.total_money) , count(*)
      FROM
        "order" o
      WHERE
        EXTRACT(YEAR FROM o.created_at) = ? AND
        o.company_id = ?
      GROUP BY 
        EXTRACT(MONTH FROM o.created_at)
    `;

    return this.em.getConnection().execute(rawQuery, [year, companyId]);
  }
}
