import { gql } from 'apollo-server';
import { getRepository } from 'typeorm';
import { User } from './user-entity';
import { JWTProvider } from './providers/jwt-provider/jwt-provider';
import { HashProvider } from './providers/hash-provider/hash-provider';
import { AppError } from 'src/errors/errors';
import { FormatCpf, ValidateEmail, ValidateCpf, ValidatePassword } from 'src/utils';

export const UserTypeDefs = gql`
  type User {
    id: String!
    name: String!
    email: String!
    birthDate: String!
    cpf: String!
  }

  input UserLoginInput {
    email: String!
    password: String!
    "If this option is set as TRUE, than you will have a long time until the token expires"
    rememberMe: Boolean
  }

  type UserLoginResponse {
    user: User!
    token: String!
    "If this option is set as TRUE, than you will have a long time until the token expires"
    rememberMe: Boolean!
  }

  input UserRegisterInput {
    name: String!
    "Valid format: YourEmail@provider.domain"
    email: String!
    "Min 7 characters, 1 letter and 1 number"
    password: String!
    "Valid formats: 123.456.789-01 or 12345678901"
    cpf: String!
    birthDate: String!
  }

  type UserRegisterResponse {
    user: User!
  }

  type Mutation {
    login(input: UserLoginInput!): UserLoginResponse!
    register(input: UserRegisterInput!): UserRegisterResponse
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

interface UserRegisterParams {
  input: {
    name: string;
    email: string;
    password: string;
    cpf: string;
    birthDate: string;
  };
}

interface UserRegisterResponse {
  user: User;
}

export const UserResolvers = {
  Mutation: {
    login: async (_, { input }: UserLoginParams): Promise<UserLoginResponse> => {
      const hashProvider = new HashProvider();
      const jwtProvider = new JWTProvider();
      const { email, password, rememberMe = false } = input;
      const usersRepository = getRepository(User);

      if (!email || !password) {
        throw new AppError('Unauthorized. Possible invalid credentials.', 401, 'Email or Password is null.');
      }

      if (email && !ValidateEmail(email)) {
        throw new AppError('Unauthorized. Possible invalid credentials.', 401, 'Invalid email format.');
      }

      const user = await usersRepository.findOne({ email });

      if (!user) {
        throw new AppError('Unauthorized. Possible invalid credentials.', 401, 'User not found.');
      }

      const passswordMatch = await hashProvider.verify(password, user.password);

      if (!passswordMatch) {
        throw new AppError('Unauthorized. Possible invalid credentials.', 401, 'Password does not match.');
      }

      const token = jwtProvider.sign({ payload: { userId: user.id }, rememberMe });

      return { user, token, rememberMe };
    },

    register: async (_, { input }: UserRegisterParams, context): Promise<UserRegisterResponse> => {
      if (!context.token) {
        throw new AppError('Unauthorized. Please log in first.', 401, 'Token not provided.');
      }

      const { name, email, cpf, birthDate } = input;

      const hashProvider = new HashProvider();
      const usersRepository = getRepository(User);

      if (!name || !email || !cpf || !birthDate || !input.password) {
        throw new AppError('Register could not be done.', 400, 'Verify if all fields is filled with valid data.');
      }

      if (!ValidateEmail(email)) {
        throw new AppError('Register could not be done.', 400, 'Verify if email field has a valid format.');
      }

      const emailAlreadyExists = await usersRepository.findOne({ email });

      if (emailAlreadyExists) {
        throw new AppError('Register could not be done.', 401, 'Email already registred.');
      }

      if (!ValidatePassword(input.password)) {
        throw new AppError(
          'Register could not be done.',
          400,
          'Verify if password field has a valid format. Min 7 characters, 1 letter and 1 number',
        );
      }
      if (!ValidateCpf(cpf)) {
        throw new AppError('Register could not be done.', 400, 'Verify if cpf field has a valid format.');
      }

      const password = await hashProvider.generate(input.password);

      const user = await usersRepository.save({
        birthDate,
        cpf: FormatCpf(cpf),
        email,
        name,
        password,
      });

      return { user };
    },
  },
};
