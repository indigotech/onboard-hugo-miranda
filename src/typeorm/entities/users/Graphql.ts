import { gql } from 'apollo-server';
import HashProvider from './providers/HashProvider/implementations/HashProvider';
import { getRepository } from 'typeorm';
import User from './User';

export const userTypeDefs = gql`
  type User {
    id: String!
    name: String!
    email: String!
    birthDate: String!
    cpf: String!
  }

  type LoginResponse {
    user: User!
    token: String!
  }

  type Mutation {
    login(login: LoginInput!): LoginResponse!
  }

  input LoginInput {
    "User email"
    email: String!
    "User password"
    password: String!
  }
`;

interface UserLoginParams {
  login: {
    email: string;
    password: string;
  };
}

interface UserLoginResponse {
  token: string;
  user: User;
}

export const userResolvers = {
  Mutation: {
    login: async (_, { login }: UserLoginParams): Promise<UserLoginResponse> => {
      const hashProvider = new HashProvider();
      const { email, password } = login;
      const usersRepository = getRepository(User);

      if (!email || !password) {
        throw new Error('Unauthorized. Possible invalid credentials.');
      }

      const user = await usersRepository.findOne({ email });

      const passswordMatch = await hashProvider.verify(password, user.password);

      if (!user || !passswordMatch) {
        throw new Error('Unauthorized. Possible invalid credentials.');
      }

      const token = 'Token';

      return { user, token };
    },
  },
};
