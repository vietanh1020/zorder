import { Migration } from '@mikro-orm/migrations';

export class Migration20240114054515 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order" drop column "note";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" add column "note" varchar(255) not null;');
  }

}
