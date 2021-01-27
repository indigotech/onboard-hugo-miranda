import { gql } from 'apollo-server';
import {
  UserLoginMutationTypeDefs,
  UserRegisterMutationTypeDefs,
  UserSearchQueryTypeDefs,
  UserListQueryTypeDefs,
  register,
  login,
  search,
  list,
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
  UserListQueryTypeDefs,
];

export const UserResolvers = {
  Query: {
    search,
    list,
  },
  Mutation: {
    register,
    login,
  },
};
