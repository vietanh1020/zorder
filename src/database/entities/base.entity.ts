import { PrimaryKey, Property, UuidType } from '@mikro-orm/core';
import { v4 as UuIdv4 } from 'uuid';

export abstract class BaseEntity {
  @PrimaryKey({ type: UuidType })
  id: string = UuIdv4();

  @Property({ fieldName: 'created_at', type: 'date' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ fieldName: 'deleted_at', nullable: true })
  deletedAt: Date;
}
