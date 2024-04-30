import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'category' })
export class Category extends BaseEntity {
  @Property()
  companyId?: string;

  @Property({ fieldName: 'name' })
  name: string;

  @Property({ fieldName: 'priority' })
  priority: number;
}
