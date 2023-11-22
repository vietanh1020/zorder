import { Migration } from '@mikro-orm/migrations';

export class Migration20231122034647 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "card" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "company_id" varchar(255) not null, "card_name" varchar(255) not null, "email" varchar(255) not null, "metadata" jsonb not null, "is_default" boolean not null default true, constraint "card_pkey" primary key ("id"));');

    this.addSql('create table "Chat" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "email" varchar(255) not null, "card_name" varchar(255) not null, constraint "Chat_pkey" primary key ("id"));');

    this.addSql('create table "invoice" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "company_id" varchar(255) not null, "status" varchar(255) not null, "image" varchar(255) not null, "from_date" varchar(255) not null, "to_date" varchar(255) not null, "method" varchar(255) not null default \'Card\', "amount" int not null, "details" varchar(255) not null, constraint "invoice_pkey" primary key ("id"));');

    this.addSql('alter table "order" add column "status" int not null default 1;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "card" cascade;');

    this.addSql('drop table if exists "Chat" cascade;');

    this.addSql('drop table if exists "invoice" cascade;');

    this.addSql('alter table "order" drop column "status";');
  }

}
