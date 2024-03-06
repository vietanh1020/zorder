import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'device' })
export class Device extends BaseEntity {
  @Property({ fieldName: 'company_id' })
  companyId: string;

  @Property()
  token: string;

  @Property({ fieldName: 'user_id' })
  userId: string;
}
