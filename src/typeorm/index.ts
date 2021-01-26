import { Connection, createConnection } from 'typeorm';
import { DatabaseConfig } from '@config/database';

export async function connectDB(): Promise<Connection> {
  try {
    const connection = await createConnection(DatabaseConfig);
    console.log(`Database connection to "${connection.driver.database}" was successful!`);
    return connection;
  } catch (error) {
    console.log(`Something went wrong with database connection
    \n${error?.message}`);
  }
}
