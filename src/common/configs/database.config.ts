import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  (): Record<string, any> => ({
    host:
      process.env?.DATABASE_HOST ??
      'mongodb://localhost:27017,localhost:27018,localhost:27019',
    name: process.env?.DATABASE_NAME ?? 'nestjs-skeleton',
    user: process.env?.DATABASE_USER,
    password: process?.env.DATABASE_PASSWORD,
    debug: process.env.DATABASE_DEBUG === 'true',
    options: process.env?.DATABASE_OPTIONS,
    SQLType: process.env.SQL_TYPE ?? 'postgres',
    SQLHost: process.env.SQL_HOST,
    SQLPort: process.env.SQL_PORT,
    SQLUsername: process.env.SQL_USER,
    SQLDatabase: process.env.SQL_DATABASE ?? 'nestjs-skeleton',
    SQLPassword: process.env.SQL_PASSWORD,
  }),
);
