import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'invoice' })
export class Invoice extends BaseEntity {
  @Property()
  companyId?: string;

  @Property()
  status: 'Success' | 'Failed';

  @Property()
  image: string;

  @Property({ fieldName: 'from_date' })
  fromDate: string;

  @Property({ fieldName: 'to_date' })
  toDate: string;

  @Property({ fieldName: 'method', default: 'Card' })
  paymentMethod: string;

  @Property({ type: 'number' })
  amount: number;

  @Property()
  details: any;
}
