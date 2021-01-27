import { connectDB } from 'src/typeorm';
import { userSeeds } from './user.seeds';

async function run() {
  const con = await connectDB();

  await userSeeds();

  await con.close();
}

run().catch((error) => {
  console.log(error);
});
