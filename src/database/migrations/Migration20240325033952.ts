import { Migration } from '@mikro-orm/migrations';

export class Migration20240325033952 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "order_detail" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "company_id" varchar(255) not null, "order_id" varchar(255) not null, "detail" jsonb not null, "status" varchar(255) not null default 0, constraint "order_detail_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "order_detail" cascade;');
  }

}
