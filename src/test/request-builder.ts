interface IRequestBuilder {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface IRequestBuilderResponse {
  query: string;
  variables: {
    input: IRequestBuilder;
  };
}

export const QueryLoginMutation = (input: IRequestBuilder): IRequestBuilderResponse => {
  return {
    query: `mutation login ($input: LoginInput! ) {
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
