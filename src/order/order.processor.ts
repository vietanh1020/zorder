import { Order } from '@/database/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { FunctionOrder } from './order.func';

@Processor('order')
export class OrderProcessor {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
    private readonly functionOrder: FunctionOrder,
  ) {}

  @Process('create')
  async createProcessOrder({ data }: Job<Order>) {
    const { order, menu } = data as any;
    try {
      return await this.functionOrder.createNewOrder(order, menu);
    } catch (error) {}
  }
}
