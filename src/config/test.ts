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
        cpf: '12345678900',
      },
      {
        name: 'Ricardo',
        email: 'ricardo@hotmail.com',
        password: '4np4ssw0rd',
        birthDate: '25/09/1987',
        cpf: '01234567890',
      },
      {
        name: 'Thiago',
        email: 'thiago@outlook.com',
        password: 's3nh4000',
        birthDate: '02/12/1996',
        cpf: '09876543210',
      },
    ],
  },
};
