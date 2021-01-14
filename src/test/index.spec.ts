import '@config/env';
import { expect } from 'chai';
import { beforeEach } from 'mocha';
import { runServer } from 'src/server';
import { HashProvider } from 'src/typeorm/entities/users/providers/hash-provider/hash-provider';
import { JWTProvider } from 'src/typeorm/entities/users/providers/jwt-provider/jwt-provider';
import { User } from 'src/typeorm/entities/users/user-entity';
import supertest from 'supertest';
import { getRepository, Repository } from 'typeorm';

let baseURL: string;
let usersRepository: Repository<User>;
let hashProvider: HashProvider;
let jwtProvider: JWTProvider;
before(async () => {
  await runServer();
  usersRepository = getRepository(User);
  hashProvider = new HashProvider();
  jwtProvider = new JWTProvider();
  baseURL = `http://localhost:${process.env.SERVER_PORT}/graphql`;
});

describe('Testing GraphQL - Hello', () => {
  it('Should perform a successful request to Graphql endpoint - Hello', async () => {
    const request = {
      query: `{ hello }`,
    };
    console.log(baseURL);

    const {
      body: { data },
    } = await supertest(baseURL).post('').send(request);

    expect(data.hello).to.be.eq('hello, world!');
  });
});

describe('E2E GraphQL - Mutation - User', () => {
  beforeEach(async () => {
    const users: User[] = [];

    for (let i = 1; i <= 3; i++) {
      const password = await hashProvider.generate(`userpassword${i}`);
      const user = usersRepository.create({
        name: `username${i}`,
        email: `useremail${i}`,
        password,
        birthDate: `userbirthDate${i}`,
        cpf: `usercpf${i}`,
      });
      users.push(user);
    }
    await usersRepository.save(users);
  });

  afterEach(async () => await usersRepository.delete({}));

  it('Should perform a successfull login returning a valid jwt token', async () => {
    const request = {
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
        input: {
          email: 'useremail1',
          password: 'userpassword1',
        },
      },
    };

    // console.log(request);
    let response;
    let verifiedToken;
    try {
      const { body } = await supertest(baseURL).post('').send(request);
      response = body.data.login;

      verifiedToken = await jwtProvider.verify(response.token);
    } catch (error) {
      console.log(error);
    }

    expect(response)
      .to.has.property('user')
      .which.is.a('object')
      .that.has.keys(['id', 'name', 'email', 'cpf', 'birthDate']);

    expect(response).to.has.property('token').which.is.a('string');
    expect(verifiedToken)
      .to.has.property('payload')
      .which.is.a('object')
      .that.includes.keys(['id', 'name', 'email', 'cpf', 'birthDate']);
  });
});
