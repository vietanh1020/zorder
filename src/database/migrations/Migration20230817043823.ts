import { Migration } from '@mikro-orm/migrations';

export class Migration20230817043823 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "food" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "company_id" varchar(255) not null, "name" varchar(255) not null, "image" varchar(255) not null, "description" varchar(255) not null, constraint "food_pkey" primary key ("id"));');

    this.addSql('create table "food_options" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "food_id" varchar(255) not null, "label" varchar(255) not null, "data" jsonb null, constraint "food_options_pkey" primary key ("id"));');

    this.addSql('drop table if exists "menu" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "menu" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "company_id" varchar(255) not null, "name" varchar(255) not null, "image" varchar(255) not null, "description" varchar(255) not null, constraint "menu_pkey" primary key ("id"));');

    this.addSql('drop table if exists "food" cascade;');

    this.addSql('drop table if exists "food_options" cascade;');
  }

}
