import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Company } from './company.entity';
import { FoodOrderDto } from '@/order/dto';

@Entity({ tableName: 'order' })
export class Order extends BaseEntity {
  @Property({ fieldName: 'company_id' })
  companyId: string;

  @Property({ fieldName: 'table_id' })
  tableId: string;

  @Property({ fieldName: 'table_number' })
  tableNumber: number;

  @Property()
  note: string;

  @Property({ type: 'json', nullable: true })
  foods: FoodOrderDto[];

  @ManyToOne({ entity: () => Company, nullable: true })
  company: Company;
}
