import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'menu' })
export class Menu extends BaseEntity {
  @Property({ fieldName: 'company_id' })
  companyId: string;

  @Property()
  name: string;

  @Property()
  image: string;

  @Property()
  description: string;

  @Property({ fieldName: 'deleted_at' })
  deletedAt: Date;
}
