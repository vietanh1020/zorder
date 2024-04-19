import { Migration } from '@mikro-orm/migrations';

export class Migration20240419041022 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order" add column "customer_name" varchar(255) not null;');

    this.addSql('alter table "order_detail" add column "customer_name" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" drop column "customer_name";');

    this.addSql('alter table "order_detail" drop column "customer_name";');
  }

}
