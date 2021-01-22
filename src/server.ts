import '@config/env';
import 'reflect-metadata';
import { connectDB } from './typeorm';
import { ApolloServer, gql } from 'apollo-server';
import { UserResolvers, UserTypeDefs } from './typeorm/entities/users/graphql';
import { Environments, SelectedEnv } from '@config/env';
import { JWTProvider } from './typeorm/entities/users/providers/jwt-provider/jwt-provider';

export async function runServer(): Promise<void> {
  await connectDB();

  const helloTypeDefs = gql`
    type Query {
      hello: String
    }
    type Mutation {
      _empty: String
    }
  `;

  const helloResolvers = {
    Query: {
      hello: () => {
        return 'hello, world!';
      },
    },
  };

  const typeDefs = [helloTypeDefs, ...UserTypeDefs];

  const resolvers = [helloResolvers, UserResolvers];

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      let decodedToken;
      if (req.headers.authorization) {
        const [, token] = req.headers.authorization.split(' ') || '';
        const jwtProvider = new JWTProvider();

        decodedToken = await jwtProvider.verify(token);
      }

      return { token: decodedToken };
    },
  });

  try {
    const { url } = await server.listen({ port: process.env.SERVER_PORT });
    console.log(`server is running on ${url}`);
  } catch (error) {
    console.log(`Something went wrong.\n${error.message}`);
  }
}

if (SelectedEnv !== Environments.TEST) {
  runServer().catch((error) => {
    console.log(`Something went wrong.\n${error.message}`);
  });
}
