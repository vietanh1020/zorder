import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'bill' })
export class Bill extends BaseEntity {
  @Property()
  companyId?: string;

  @Property({ type: 'number', autoincrement: true })
  bill_number: number;

  @Property({ type: 'json', nullable: false })
  orderIds: string[];
}
