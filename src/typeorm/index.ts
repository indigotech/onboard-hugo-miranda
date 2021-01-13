import { createConnection } from 'typeorm';
import { DatabaseConfig } from '@config/database';

createConnection(DatabaseConfig)
  .then(() => console.log(`Database connection was successful!`))
  .catch((error) => {
    console.log(`Something went wrong with database connection
    \n${error?.message}`);
  });
