import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'company' })
export class Company extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  image: string;

  @Property()
  address: string;

  @Property()
  openAt: string;

  @Property()
  closeAt: string;

  @Property()
  openDay: string;
}
