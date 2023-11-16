import { Order } from '@/database/entities';
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
import { CreateOrderDto } from './dto';
import { FunctionOrder } from './order.func';
import { OrderStatus } from '@/types/order';
import * as moment from 'moment';

@Injectable()
export class OrderService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('order') private readonly orderQueue: Queue,

    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
    private readonly menuService: MenuService,
    private readonly functionOrder: FunctionOrder,
  ) {}

  async companyGetOrder(companyId: string, status?: number, date?: Date) {
    let isBlock = await this.cacheManager.get('blocked:' + companyId);
    if (!!isBlock)
      throw new BadRequestException(
        'Dịch vụ bị block bởi vì cửa hàng chưa thanh toán',
      );

    let query: any = {};

    if (!!status) query.status = status;
    if (!!date) {
      query.createdAt = {
        $gte: moment(date).startOf('date').toDate(),
        $lt: moment(date).endOf('date').toDate(),
      };
    } else {
      query.createdAt = {
        $gte: moment().subtract(1, 'days').toDate(),
        $lt: new Date(),
      };
    }

    return await this.orderRepository.find({
      companyId,
      ...query,
    });
  }

  async getOrderDetails(id: string, companyId: string) {
    let isBlock = await this.cacheManager.get('blocked:' + companyId);
    if (!!isBlock)
      throw new BadRequestException(
        'Dịch vụ bị block bởi vì cửa hàng chưa thanh toán',
      );

    const order = await this.orderRepository.findOne({ id, companyId });
    if (!order) throw new NotFoundException();
  }

  async createOrder(order: CreateOrderDto) {
    const { companyId } = order;
    let menu: any = await this.cacheManager.get('menu_' + companyId);
    if (!menu) {
      menu = await this.menuService.getMenu(companyId);
    }

    try {
      const job = await this.orderQueue.add('create', { order, menu });
      return job.finished();
    } catch (error) {
      console.log(error);
    }

    return await this.functionOrder.createNewOrder(order, menu);
  }
}
