export default () => ({
  env: process.env.NODE_ENV || 'development',

  appId: process.env.APP_ID || 'nestjs-template',

  jwtSecret: process.env.JWT_SECRET || '___JWT_SECRET___',

  database: {
    type: process.env.DB_TYPE || 'postgresql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    dbMain: process.env.DB_MAIN || 'app_db',
    dbTest: process.env.DB_TEST || 'app_test',
  },
});
