import * as dotenv from 'dotenv';
import path from 'path';

const envPaths = {
  TEST: path.resolve(__dirname, '..', '..', '.test.env'),
  DEV: path.resolve(__dirname, '..', '..', '.env'),
};

const selectedEnv = process.env.ENV;

dotenv.config({ path: envPaths[selectedEnv] });
console.log(`Setup environment as ${selectedEnv}, file loaded: ${envPaths[selectedEnv]}`);