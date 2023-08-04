import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/database/BaseEntity';

@Entity({ tableName: 'labels' })
export class Photo extends BaseEntity {
  @Property({ fieldName: 'company_id' })
  companyId: string;

  @Property({ fieldName: 'user_id', nullable: true })
  userId: string;

  @Property({ fieldName: 'created_by', nullable: true })
  createdBy: string;

  @Property({ fieldName: 'updated_by', nullable: true })
  updatedBy: string;

  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  color: string;
}
