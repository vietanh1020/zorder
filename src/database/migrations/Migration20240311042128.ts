import { Migration } from '@mikro-orm/migrations';

export class Migration20240311042128 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "device" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "company_id" varchar(255) not null, "token" varchar(255) not null, "user_id" varchar(255) not null, constraint "device_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "device" cascade;');
  }

}
