import { Migration } from '@mikro-orm/migrations';

export class Migration20240325042842 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order_detail" alter column "status" type int using ("status"::int);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order_detail" alter column "status" type varchar(255) using ("status"::varchar(255));');
  }

}
