import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Food } from './food.entity';

type FoodOrder = {
  price: number;
  quantity: number;
  note: string;
  food: Food;
};
@Entity({ tableName: 'order' })
export class Order extends BaseEntity {
  @Property({ fieldName: 'company_id' })
  companyId: string;

  @Property({ fieldName: 'table_id' })
  tableId: string;

  @Property({ fieldName: 'total_money' })
  total: number;

  @Property({ type: 'number', default: 0 })
  status: number; // 0: pending, 1: dong y,  -1: cancel, 2: success

  @Property({ type: 'json', nullable: true })
  foods: FoodOrder[];
}
