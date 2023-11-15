import { Migration } from '@mikro-orm/migrations';

export class Migration20230825032352 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "company" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "description" varchar(255) not null, "image" varchar(255) not null, "address" varchar(255) not null, constraint "company_pkey" primary key ("id"));');

    this.addSql('create table "food" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "company_id" varchar(255) not null, "name" varchar(255) not null, "image" varchar(255) not null, "description" varchar(255) not null, "price" int not null, constraint "food_pkey" primary key ("id"));');

    this.addSql('create table "food_options" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "food_id" uuid null, "label" varchar(255) not null, "data" jsonb null, constraint "food_options_pkey" primary key ("id"));');

    this.addSql('create table "order" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "company_id" varchar(255) not null, "table_id" varchar(255) not null, "total_money" int not null, "note" varchar(255) not null, "foods" jsonb null, constraint "order_pkey" primary key ("id"));');

    this.addSql('create table "user" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "email" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "address" varchar(255) not null, "phone" varchar(255) not null, "company_id" uuid null, "password" varchar(255) not null, "role" varchar(255) not null, constraint "user_pkey" primary key ("id"));');

    this.addSql('alter table "food_options" add constraint "food_options_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete set null;');

    this.addSql('alter table "user" add constraint "user_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_company_id_foreign";');

    this.addSql('alter table "food_options" drop constraint "food_options_food_id_foreign";');

    this.addSql('drop table if exists "company" cascade;');

    this.addSql('drop table if exists "food" cascade;');

    this.addSql('drop table if exists "food_options" cascade;');

    this.addSql('drop table if exists "order" cascade;');

    this.addSql('drop table if exists "user" cascade;');
  }

}
