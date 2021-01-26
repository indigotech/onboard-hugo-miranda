import { gql } from 'apollo-server';
import {
  UserLoginMutationTypeDefs,
  UserRegisterMutationTypeDefs,
  UserSearchQueryTypeDefs,
  register,
  login,
  search,
} from './graphql/';

const UserType = gql`
  type User {
    id: String!
    name: String!
    email: String!
    birthDate: String!
    cpf: String!
  }
`;

export const UserTypeDefs = [
  UserType,
  UserRegisterMutationTypeDefs,
  UserLoginMutationTypeDefs,
  UserSearchQueryTypeDefs,
];

export const UserResolvers = {
  Query: {
    search,
  },
  Mutation: {
    register,
    login,
  },
};
