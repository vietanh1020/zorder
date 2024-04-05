import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'category' })
export class Card extends BaseEntity {
  @Property()
  companyId?: string;

  @Property({ fieldName: 'name' })
  name: string;

  @Property({ fieldName: 'priority' })
  priority: string;

  @Property({ type: 'boolean', default: true })
  isDefault: boolean;
}
