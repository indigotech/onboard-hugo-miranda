import * as dotenv from 'dotenv';
import path from 'path';

export const SelectedEnv = process.env.ENV || 'DEFAULT';

export enum Environments {
  TEST = 'TEST',
  DEV = 'DEV',
  DEFAULT = 'DEFAULT',
}

const envPaths = {
  [Environments.TEST]: path.resolve(__dirname, '..', '..', '.test.env'),
  [Environments.DEV]: path.resolve(__dirname, '..', '..', '.dev.env'),
  [Environments.DEFAULT]: path.resolve(__dirname, '..', '..', '.env'),
};

dotenv.config({ path: envPaths[SelectedEnv] });
console.log(`Setup environment as ${SelectedEnv}, file loaded: ${envPaths[SelectedEnv]}`);
