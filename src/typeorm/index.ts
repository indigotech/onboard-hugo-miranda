import { createConnection } from 'typeorm';
import { DatabaseConfig } from '@config/database';

export async function connectDB(): Promise<void> {
  try {
    await createConnection(DatabaseConfig);
    console.log(`Database connection was successful!`);
  } catch (error) {
    console.log(`Something went wrong with database connection
    \n${error?.message}`);
  }
}
