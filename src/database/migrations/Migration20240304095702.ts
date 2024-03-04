import { Migration } from '@mikro-orm/migrations';

export class Migration20240304095702 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "food_options" add column "is_multiple" boolean not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "food_options" drop column "is_multiple";');
  }

}
