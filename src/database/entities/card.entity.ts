import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'card' })
export class Card extends BaseEntity {
  @Property()
  companyId?: string;

  @Property({ fieldName: 'card_name' })
  cardName: string;

  @Property()
  email: string;

  @Property({ type: 'json', nullable: false })
  metadata: any;

  @Property({ type: 'boolean', default: true })
  isDefault: boolean;
}
