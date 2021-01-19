import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Environments, SelectedEnv } from './env';

const isTestEnv = SelectedEnv === Environments.TEST;

export const DatabaseConfig: PostgresConnectionOptions = {
  name: 'default',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logNotifications: isTestEnv,
  synchronize: isTestEnv,
  entities: ['./src/typeorm/entities/*/*-entity.ts'],
  migrations: ['./src/typeorm/migrations/*.ts'],
};
