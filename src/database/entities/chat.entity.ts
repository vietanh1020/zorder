import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'Chat' })
export class Chat extends BaseEntity {
  @Property()
  email: string;

  @Property({ fieldName: 'card_name' })
  text: string;
}
