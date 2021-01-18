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
const users: User[] = [];

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

    const {
      body: { data },
    } = await supertest(baseURL).post('').send(request);

    expect(data.hello).to.be.eql('hello, world!');
  });
});

describe('E2E GraphQL - Mutation - User', () => {
  beforeEach(async () => {
    const password = await hashProvider.generate(`userpassword1`);
    const user = usersRepository.create({
      name: `username1`,
      email: `useremail1`,
      password,
      birthDate: `userbirthDate1`,
      cpf: `usercpf1`,
    });
    users.push(user);
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
          rememberMe
        }
      }`,
      variables: {
        input: {
          email: 'useremail1',
          password: 'userpassword1',
          rememberMe: false,
        },
      },
    };

    const { body } = await supertest(baseURL).post('').send(request);
    const response = body.data.login;

    const verifiedToken = await jwtProvider.verify(response.token);

    expect(response).to.have.property('user').to.be.deep.eq({
      id: users[0].id.toString(),
      name: 'username1',
      email: 'useremail1',
      birthDate: 'userbirthDate1',
      cpf: 'usercpf1',
    });

    expect(response).to.have.property('token').which.is.a('string');
    expect(verifiedToken.payload.userId).to.be.eq(users[0].id);
  });

  it('Should validate jwt token after expiration time (not remember me)', async () => {
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
          rememberMe
        }
      }`,
      variables: {
        input: {
          email: 'useremail1',
          password: 'userpassword1',
          rememberMe: false,
        },
      },
    };

    const { body } = await supertest(baseURL).post('').send(request);
    const response = body.data.login;

    const verifiedToken = await jwtProvider.verify(response.token);

    expect(response).to.have.property('user').to.be.deep.eq({
      id: users[0].id.toString(),
      name: 'username1',
      email: 'useremail1',
      birthDate: 'userbirthDate1',
      cpf: 'usercpf1',
    });

    const currentTimestamp = new Date();
    currentTimestamp.setMilliseconds(0);

    const expectExpiration = currentTimestamp;
    expectExpiration.setMinutes(currentTimestamp.getMinutes() + 15);

    const tokenExpires = new Date(verifiedToken.exp * 1000);

    const expiresIn15m = +expectExpiration === +tokenExpires;
    const isTokenExpired = currentTimestamp > tokenExpires;

    expect(isTokenExpired).to.be.eq(false);
    expect(expiresIn15m).to.be.eq(true);
  });

  it('Should validate jwt token after expiration time (remember me)', async () => {
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
          rememberMe
        }
      }`,
      variables: {
        input: {
          email: 'useremail1',
          password: 'userpassword1',
          rememberMe: true,
        },
      },
    };

    const { body } = await supertest(baseURL).post('').send(request);
    const response = body.data.login;

    const verifiedToken = await jwtProvider.verify(response.token);

    expect(response).to.have.property('user').to.be.deep.eq({
      id: users[0].id.toString(),
      name: 'username1',
      email: 'useremail1',
      birthDate: 'userbirthDate1',
      cpf: 'usercpf1',
    });

    const currentTimestamp = new Date();
    currentTimestamp.setMilliseconds(0);

    const expectExpiration = currentTimestamp;
    expectExpiration.setMinutes(currentTimestamp.getMinutes() + 30);

    const tokenExpires = new Date(verifiedToken.exp * 1000);

    const expiresIn15m = +expectExpiration === +tokenExpires;
    const isTokenExpired = currentTimestamp > tokenExpires;

    expect(isTokenExpired).to.be.eq(false);
    expect(expiresIn15m).to.be.eq(true);
  });

  it('Should not validate jwt token after expiration time', async () => {
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
          rememberMe
        }
      }`,
      variables: {
        input: {
          email: 'useremail1',
          password: 'userpassword1',
          rememberMe: false,
        },
      },
    };

    const { body } = await supertest(baseURL).post('').send(request);
    const response = body.data.login;

    const verifiedToken = await jwtProvider.verify(response.token);

    const tokenExpires = new Date(verifiedToken.exp * 1000);
    const afterExpires = new Date();
    afterExpires.setMilliseconds(0);

    const expectExpiration = afterExpires;
    expectExpiration.setMinutes(afterExpires.getMinutes() - 1);
    const isTokenExpired = tokenExpires > afterExpires;

    expect(isTokenExpired).to.be.eql(true);
  });
});
