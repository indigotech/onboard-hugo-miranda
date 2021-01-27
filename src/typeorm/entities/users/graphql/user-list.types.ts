import { gql } from 'apollo-server';

export const UserListQueryTypeDefs = gql`
  input UserListInput {
    limit: Int
    page: Int
  }

  type Info {
    limit: Int!
    page: Int!
    pages: Int!
  }
  type UserListResponse {
    users: [User!]!
    info: Info!
  }

  extend type Query {
    list(input: UserListInput!): UserListResponse
  }
`;
