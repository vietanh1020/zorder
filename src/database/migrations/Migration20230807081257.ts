import { Migration } from '@mikro-orm/migrations';

export class Migration20230807081257 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "menu" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "company_id" varchar(255) not null, "name" varchar(255) not null, "image" varchar(255) not null, "description" varchar(255) not null, "deleted_at" timestamptz(0) not null, constraint "menu_pkey" primary key ("id"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "menu" cascade;');
  }
}
