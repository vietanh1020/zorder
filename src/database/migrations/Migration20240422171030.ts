import { Migration } from '@mikro-orm/migrations';

export class Migration20240422171030 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "bill" add column "bill_number" int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "bill" drop column "bill_number";');
  }

}
