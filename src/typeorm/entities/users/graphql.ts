import { gql } from 'apollo-server';
import { getRepository } from 'typeorm';
import { User } from './user-entity';
import { JWTProvider } from './providers/jwt-provider/jwt-provider';
import { HashProvider } from './providers/hash-provider/hash-provider';

export const UserTypeDefs = gql`
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
    "If this option is set as TRUE, than you will have a long time until the token expires"
    rememberMe: Boolean!
  }

  type Mutation {
    login(input: LoginInput!): LoginResponse!
  }

  input LoginInput {
    email: String!
    password: String!
    "If this option is set as TRUE, than you will have a long time until the token expires"
    rememberMe: Boolean
  }
`;

interface UserLoginParams {
  input: {
    email: string;
    password: string;
    rememberMe: boolean;
  };
}

interface UserLoginResponse {
  token: string;
  user: User;
  rememberMe: boolean;
}

export const UserResolvers = {
  Mutation: {
    login: async (_, { input }: UserLoginParams): Promise<UserLoginResponse> => {
      const hashProvider = new HashProvider();
      const jwtProvider = new JWTProvider();
      const { email, password, rememberMe = false } = input;
      const usersRepository = getRepository(User);

      if (!email || !password) {
        throw new Error('Unauthorized. Possible invalid credentials.');
      }

      const user = await usersRepository.findOne({ email });

      const passswordMatch = await hashProvider.verify(password, user.password);

      if (!user || !passswordMatch) {
        throw new Error('Unauthorized. Possible invalid credentials.');
      }

      const token = jwtProvider.sign({ payload: user, rememberMe });

      return { user, token, rememberMe };
    },
  },
};
