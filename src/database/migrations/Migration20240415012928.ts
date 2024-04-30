import { Migration } from '@mikro-orm/migrations';

export class Migration20240415012928 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "category" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "company_id" varchar(255) not null, "name" varchar(255) not null, "priority" int not null, constraint "category_pkey" primary key ("id"));');

    this.addSql('alter table "company" add column "open_at" varchar(255) not null, add column "close_at" varchar(255) not null, add column "open_day" varchar(255) not null;');

    this.addSql('alter table "food" add column "category" varchar(255) not null, add column "price_origin" int not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "category" cascade;');

    this.addSql('alter table "company" drop column "open_at";');
    this.addSql('alter table "company" drop column "close_at";');
    this.addSql('alter table "company" drop column "open_day";');

    this.addSql('alter table "food" drop column "category";');
    this.addSql('alter table "food" drop column "price_origin";');
  }

}
