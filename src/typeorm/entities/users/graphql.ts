import { gql } from 'apollo-server';
import { UserLoginMutationTypeDefs, UserRegisterMutationTypeDefs, register, login } from './graphql/';

const UserType = gql`
  type User {
    id: String!
    name: String!
    email: String!
    birthDate: String!
    cpf: String!
  }
`;

export const UserTypeDefs = [UserType, UserRegisterMutationTypeDefs, UserLoginMutationTypeDefs];

export const UserResolvers = {
  Mutation: {
    register,
    login,
  },
};
