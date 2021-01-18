import * as dotenv from 'dotenv';
import path from 'path';

export const SelectedEnv = process.env.ENV || 'DEV';

export enum Environments {
  TEST = 'TEST',
  DEV = 'DEV',
}

const envPaths = {
  [Environments.TEST]: path.resolve(__dirname, '..', '..', '.test.env'),
  [Environments.DEV]: path.resolve(__dirname, '..', '..', '.dev.env'),
};

dotenv.config({ path: envPaths[SelectedEnv] });
console.log(`Setup environment as ${SelectedEnv}, file loaded: ${envPaths[SelectedEnv]}`);
