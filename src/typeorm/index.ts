import { createConnection } from 'typeorm';

try {
  createConnection();
  console.log('Database connection was successful!');
} catch (error) {
  console.log(`Something went wrong with database connection
  \n ${error?.message}`);
}
