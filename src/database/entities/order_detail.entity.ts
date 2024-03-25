import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { FoodStatus } from '@/untils';

@Entity({ tableName: 'order_detail' })
export class OrderDetail extends BaseEntity {
  @Property()
  companyId?: string;

  @Property()
  orderId?: string;

  @Property({ type: 'json', nullable: false })
  detail: any;

  @Property({ type: 'number', default: FoodStatus.pending })
  status: number;
}
