import { gql } from 'apollo-server';

export const UserSearchQueryTypeDefs = gql`
  input UserSearchInput {
    id: Int!
  }

  type UserSearchResponse {
    user: User!
  }

  extend type Query {
    search(input: UserSearchInput!): UserSearchResponse
  }
`;
