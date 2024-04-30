import { Migration } from '@mikro-orm/migrations';

export class Migration20240422172840 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "bill" alter column "bill_number" type int using ("bill_number"::int);');
    this.addSql('create sequence if not exists "bill_bill_number_seq";');
    this.addSql('select setval(\'bill_bill_number_seq\', (select max("bill_number") from "bill"));');
    this.addSql('alter table "bill" alter column "bill_number" set default nextval(\'bill_bill_number_seq\');');
  }

  async down(): Promise<void> {
    this.addSql('alter table "bill" alter column "bill_number" type int using ("bill_number"::int);');
    this.addSql('alter table "bill" alter column "bill_number" drop default;');
  }

}
