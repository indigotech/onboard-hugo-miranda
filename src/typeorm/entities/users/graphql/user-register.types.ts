import { gql } from 'apollo-server';

export const UserRegisterMutationTypeDefs = gql`
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

  extend type Mutation {
    register(input: UserRegisterInput!): UserRegisterResponse
  }
`;
