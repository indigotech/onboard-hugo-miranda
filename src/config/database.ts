import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const DatabaseConfig: PostgresConnectionOptions = {
  name: 'default',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  port: Number(process.env.DATABASE_PORT),
  entities: ['./src/typeorm/entities/*/*-entity.ts'],
  migrations: ['./src/typeorm/migrations/*.ts'],
};
