import { User } from 'src/typeorm/entities/users/user-entity';

interface ITestConfig {
  baseURL: string;
  samples: {
    users: Array<Omit<User, 'id'>>;
  };
}

export const testConfig: ITestConfig = {
  baseURL: `http://localhost:${process.env.SERVER_PORT}/graphql`,

  samples: {
    users: [
      {
        name: 'João',
        email: 'joao@gmail.com',
        password: 'anpassw0rd',
        birthDate: '01/06/1978',
        cpf: '123.456.789-00',
      },
      {
        name: 'Ricardo',
        email: 'ricardo@hotmail.com',
        password: '4np4ssw0rd',
        birthDate: '25/09/1987',
        cpf: '012.345.678-90',
      },
      {
        name: 'Thiago',
        email: 'thiago@outlook.com',
        password: 's3nh4000',
        birthDate: '02/12/1996',
        cpf: '098.765.432-10',
      },
    ],
  },
};
