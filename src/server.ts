import './config/env';
import 'reflect-metadata';
import './typeorm';
import { ApolloServer, gql } from 'apollo-server';
import { userResolvers, userTypeDefs } from './typeorm/entities/users/Graphql';

const helloTypeDefs = gql`
  type Query {
    hello: String
  }
`;

const helloResolvers = {
  Query: {
    hello: () => {
      return 'hello, world!';
    },
  },
};

const typeDefs = [helloTypeDefs, userTypeDefs];

const resolvers = [helloResolvers, userResolvers];

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen()
  .then(({ url }) => {
    console.log(`server is running on ${url}`);
  })
  .catch((error) => {
    console.log(`Something went wrong.\n${error.message}`);
  });
