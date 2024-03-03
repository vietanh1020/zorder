import { Migration } from '@mikro-orm/migrations';

export class Migration20240303182111 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order" add column "note" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" drop column "note";');
  }

}
