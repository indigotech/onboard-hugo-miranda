import { gql } from 'apollo-server';

export const UserLoginMutationTypeDefs = gql`
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

  extend type Mutation {
    login(input: UserLoginInput!): UserLoginResponse!
  }
`;
