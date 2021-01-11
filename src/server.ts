import 'reflect-metadata';
import './typeorm';
import { ApolloServer, gql } from 'apollo-server';

const fakeUsers = [
  {
    id: '1',
    name: 'username',
    email: 'email@mail.com',
    password: 'password',
    birthdate: '04/01/2001',
    cpf: '12345678901',
  },
];

const typeDefs = gql`
  type User {
    id: String!
    name: String!
    email: String!
    password: String
    birthdate: String!
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
    login: (_, { login }) => {
      const { email, password } = login;

      const user = fakeUsers.filter((user) => user.email === email && user.password === password)[0];
      const token = 'Token';

      if (!user) {
        throw new Error('Unauthorized. Possible invalid credentials.');
      }

      const response = { user, token };

      return response;
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
