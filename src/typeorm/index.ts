import { createConnection } from 'typeorm';

try {
  createConnection();
  console.log('Database connection was successful!');
} catch ({ message }) {
  console.log(`Something went wrong with database connection
  \n ${message as string}`);
}
