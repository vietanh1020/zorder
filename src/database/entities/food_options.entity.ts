import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'food_options' })
export class FoodOption extends BaseEntity {
  @Property({ fieldName: 'food_id' })
  foodId: string;

  @Property()
  label: string;

  @Property({ type: 'json', nullable: true })
  data: { label: string; price: number }[];
}
