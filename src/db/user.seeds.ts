import faker from 'faker';
import { getRepository } from 'typeorm';
import { User } from 'src/typeorm/entities/users/user-entity';
import { HashProvider } from 'src/typeorm/entities/users/providers/hash-provider/hash-provider';

export async function userSeeds(numOfUsersToAdd = 50): Promise<void> {
  try {
    const users: User[] = [];
    const hashProvider = new HashProvider();

    const usersRepository = getRepository(User);
    for (let i = 0; i < numOfUsersToAdd; i++) {
      const password = await hashProvider.generate(`passw0rd`);
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const name = `${firstName} ${lastName}`;
      const userData = {
        name,
        email: faker.internet.email(firstName, lastName),
        password,
        cpf: `12345678900`,
        birthDate: `01/01/2000`,
      };

      users.push(usersRepository.create(userData));
    }
    await usersRepository.save(users);
  } catch (error) {
    console.log(error);
  }
}
