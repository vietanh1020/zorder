import { Migration } from '@mikro-orm/migrations';

export class Migration20240423023304 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "bill" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "bill" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "company_id" varchar(255) not null, "bill_number" serial, "order_ids" jsonb not null, constraint "bill_pkey" primary key ("id"));');
  }

}
