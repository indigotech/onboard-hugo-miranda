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
