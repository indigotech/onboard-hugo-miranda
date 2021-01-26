import { connectDB } from 'src/typeorm';
import faker from 'faker';
import { getRepository } from 'typeorm';
import { User } from 'src/typeorm/entities/users/user-entity';

export async function userSeeds(numOfUsersToAdd = 50): Promise<void> {
  try {
    await connectDB();
    const users: User[] = [];

    const usersRepository = getRepository(User);
    for (let i = 0; i < numOfUsersToAdd; i++) {
      const userData = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: `passw0rd`,
        cpf: `12345678900`,
        birthDate: `01/01/2000`,
      };

      users.push(usersRepository.create(userData));
    }
    await usersRepository.save(users);

    console.log(`${numOfUsersToAdd} users added to database!`);
  } catch (error) {
    console.log(error);
  }
}

userSeeds().catch((error) => console.log(error));
