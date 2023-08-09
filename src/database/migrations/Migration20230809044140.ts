import { Migration } from '@mikro-orm/migrations';

export class Migration20230809044140 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "company" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "description" varchar(255) not null, "image" varchar(255) not null, "address" varchar(255) not null, constraint "company_pkey" primary key ("id"));');

    this.addSql('create table "menu" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "company_id" varchar(255) not null, "name" varchar(255) not null, "image" varchar(255) not null, "description" varchar(255) not null, constraint "menu_pkey" primary key ("id"));');

    this.addSql('create table "user" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "email" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "address" varchar(255) not null, "phone" varchar(255) not null, "company_id" varchar(255) not null, "password" varchar(255) not null, "role" varchar(255) not null, constraint "user_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "company" cascade;');

    this.addSql('drop table if exists "menu" cascade;');

    this.addSql('drop table if exists "user" cascade;');
  }

}
