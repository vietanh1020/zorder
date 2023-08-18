import { Cascade, Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { FoodOption } from './food_options.entity';

@Entity({ tableName: 'food' })
export class Food extends BaseEntity {
  @Property({ fieldName: 'company_id' })
  companyId: string;

  @Property()
  name: string;

  @Property()
  image: string;

  @Property()
  description: string;

  @Property()
  price: number;

  @OneToMany(() => FoodOption, (option) => option.food, {
    cascade: [Cascade.REMOVE],
  })
  options: FoodOption[];
}
