import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Company } from './company.entity';
import { RoleType } from '@/types';

@Entity({ tableName: 'user' })
export class User extends BaseEntity {
  @Property()
  email: string;

  @Property({ fieldName: 'first_name' })
  firstName: string;

  @Property({ fieldName: 'last_name' })
  lastName: string;

  @Property()
  address: string;

  @Property()
  phone: string;

  @Property({ fieldName: 'company_id' })
  companyId: string;

  @Property()
  password: string;

  @Property()
  role: RoleType;

  @ManyToOne({ entity: () => Company, nullable: true })
  company: Company;
}
