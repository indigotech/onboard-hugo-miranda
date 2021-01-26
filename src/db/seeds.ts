import { connectDB } from 'src/typeorm';
import { UserResolvers } from 'src/typeorm/entities/users/graphql';
import { JWTProvider } from 'src/typeorm/entities/users/providers/jwt-provider/jwt-provider';
import faker from 'faker';

export async function userSeeds(numOfUsersToAdd = 50): Promise<void> {
  try {
    await connectDB();

    const jwtProvider: JWTProvider = new JWTProvider();
    const token = jwtProvider.sign({ payload: {}, rememberMe: false });

    for (let i = 0; i < numOfUsersToAdd; i++) {
      const userData = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: `passw0rd`,
        cpf: `12345678900`,
        birthDate: `01/01/2000`,
      };

      await UserResolvers.Mutation.register(
        {},
        {
          input: userData,
        },
        { token: `Bearer ${token}` },
      );
    }

    console.log(`${numOfUsersToAdd} users added to database!`);
  } catch (error) {
    console.log(error);
  }
}

userSeeds().catch((error) => console.log(error));
