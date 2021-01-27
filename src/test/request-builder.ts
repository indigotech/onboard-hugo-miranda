interface IUserLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface IRequestBuilderResponse {
  query: string;
  variables: {
    input: any;
  };
}

interface IUserRegisterRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
  birthDate: string;
}

interface IUserSearchRequest {
  id: number;
}

interface IUserListRequest {
  limit?: number;
  page?: number;
}

export const QueryUserLoginMutation = (input: IUserLoginRequest): IRequestBuilderResponse => {
  return {
    query: `mutation login ($input: UserLoginInput! ) {
      login( input: $input){
        user {
          id
          name
          email
          birthDate
          cpf
        }
        token
      }
    }`,
    variables: {
      input,
    },
  };
};

export const QueryUserRegisterMutation = (input: IUserRegisterRequest): IRequestBuilderResponse => {
  return {
    query: `mutation register($input: UserRegisterInput!) {
      register(input: $input) {
        user {
          id
          name
          email
          birthDate
          cpf
        }
      }
    }`,
    variables: {
      input,
    },
  };
};

export const QueryUserSearchQuery = (input: IUserSearchRequest): IRequestBuilderResponse => {
  return {
    query: `query search ($input: UserSearchInput!){
      search(input: $input){
        user{
          id
          name
          email
          cpf
          birthDate
        }
      }
    }`,
    variables: {
      input,
    },
  };
};

export const QueryUserListQuery = (input: IUserListRequest): IRequestBuilderResponse => {
  return {
    query: `query list ($input: UserListInput!) {
      list(input: $input) {
        info{
          limit
          page
          pages
        }
        users {
          id
          name
          email
          birthDate
          cpf
        }
      }
    }`,
    variables: {
      input,
    },
  };
};
