import { Options } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { Menu } from './database/entities/index.js';

const configService = new ConfigService();

const MikroOrmConfig: Options = {
  type: configService.get('DB_TYPE'),
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  dbName: configService.get('DB_MAIN'),
  user: configService.get('DB_USER'),
  password: configService.get('DB_PASS'),
  discovery: { warnWhenNoEntities: false },
  entities: ['./dist/database/entities'],
  // entitiesTs: [Menu],
  migrations: {
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
  },
  seeder: {
    path: './dist/database/seeders',
    pathTs: './src/database/seeders',
  },
};

export default MikroOrmConfig;
