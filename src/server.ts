import 'reflect-metadata';
import './typeorm';
import { ApolloServer, gql } from 'apollo-server';
import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import User from './typeorm/entities/User';

const typeDefs = gql`
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

  type Query {
    hello: String
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

const resolvers = {
  Query: {
    hello: () => {
      return 'hello, world!';
    },
  },

  Mutation: {
    login: async (_, { login }) => {
      const { email, password } = login;
      const usersRepository = getRepository(User);

      if (!email || !password) {
        throw new Error('Unauthorized. Possible invalid credentials.');
      }

      const user = await usersRepository.findOne({ where: { email } });

      const passswordMatch = await compare(password, user.password);

      if (!user || !passswordMatch) {
        throw new Error('Unauthorized. Possible invalid credentials.');
      }

      const token = 'Token';

      return { user, token };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen()
  .then(({ url }) => {
    console.log(`server is running on ${url}`);
  })
  .catch((error) => {
    console.log(`Something went wrong.\n${error.message}`);
  });
