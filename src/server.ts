import 'reflect-metadata';
import './typeorm';
import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => {
      return 'hello, world!';
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen()
  .then(({ url }) => {
    console.log(`server is running on ${url}`);
  })
  .catch(({ message }) => {
    console.log(`Something went wrong.\n${message as string}`);
  });
