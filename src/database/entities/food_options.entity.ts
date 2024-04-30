import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Food } from './food.entity';

@Entity({ tableName: 'food_options' })
export class FoodOption extends BaseEntity {
  @Property({ fieldName: 'food_id' })
  foodId: string;

  @Property()
  label: string;

  @Property()
  isMultiple: boolean;

  @Property({ type: 'json', nullable: true })
  data: { label: string; price: number }[];

  @ManyToOne({ entity: () => Food, nullable: true })
  food: Food;
}
