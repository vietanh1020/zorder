import { Order } from '@/database/entities';
import { MenuService } from '@/menu/menu.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectQueue } from '@nestjs/bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';
import { CreateOrderDto } from './dto';
import { FunctionOrder } from './order.func';

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

  async getOrder(id: string) {
    return await this.orderRepository.find({ id });
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
