import { testConfig } from '@config/test';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { HashProvider } from 'src/typeorm/entities/users/providers/hash-provider/hash-provider';
import { JWTProvider } from 'src/typeorm/entities/users/providers/jwt-provider/jwt-provider';
import { User } from 'src/typeorm/entities/users/user-entity';
import { formatCpf } from 'src/utils';
import supertest from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { QueryUserLoginMutation } from './request-builder';

let usersRepository: Repository<User>;
let jwtProvider: JWTProvider;
let hashProvider: HashProvider;
let user: User;

const baseURL = testConfig.baseURL;
const sampleUsers = testConfig.samples.users;
const expectedUserData = {
  name: sampleUsers[0].name,
  email: sampleUsers[0].email,
  birthDate: sampleUsers[0].birthDate,
  cpf: formatCpf(sampleUsers[0].cpf),
};

describe('E2E GraphQL - User - Mutation:Login : JWT', () => {
  beforeEach(async () => {
    usersRepository = getRepository(User);
    hashProvider = new HashProvider();
    jwtProvider = new JWTProvider();
    const password = await hashProvider.generate(sampleUsers[0].password);

    user = await usersRepository.save({
      ...sampleUsers[0],
      password,
      cpf: formatCpf(sampleUsers[0].cpf),
    });
  });

  afterEach(async () => await usersRepository.delete({}));

  it('Should perform a successfull login returning a valid jwt token', async () => {
    const request = QueryUserLoginMutation({
      email: sampleUsers[0].email,
      password: sampleUsers[0].password,
      rememberMe: false,
    });

    const { body } = await supertest(baseURL).post('').send(request);
    const response = body.data.login;

    const verifiedToken = await jwtProvider.verify(response.token);

    expect(response)
      .to.have.property('user')
      .to.be.deep.eq({
        ...expectedUserData,
        id: user.id.toString(),
      });

    expect(response).to.have.property('token').which.is.a('string');
    expect(verifiedToken.payload.userId).to.be.eq(user.id);
  });

  it('Should validate jwt token before expiration time (not remember me)', async () => {
    const request = QueryUserLoginMutation({
      email: sampleUsers[0].email,
      password: sampleUsers[0].password,
      rememberMe: false,
    });

    const { body } = await supertest(baseURL).post('').send(request);
    const response = body.data.login;

    const verifiedToken = await jwtProvider.verify(response.token);

    expect(response)
      .to.have.property('user')
      .to.be.deep.eq({
        ...expectedUserData,
        id: user.id.toString(),
      });

    const tokenExpiresAt = new Date(verifiedToken.exp * 1000);

    const afterTokenExpires = new Date((verifiedToken.exp - 1) * 1000);

    const isTokenExpired = tokenExpiresAt < afterTokenExpires;

    expect(isTokenExpired).to.be.eq(false);
  });

  it('Should validate jwt token before expiration time (remember me)', async () => {
    const request = QueryUserLoginMutation({
      email: sampleUsers[0].email,
      password: sampleUsers[0].password,
      rememberMe: true,
    });

    const { body } = await supertest(baseURL).post('').send(request);
    const response = body.data.login;

    const verifiedToken = await jwtProvider.verify(response.token);

    expect(response)
      .to.have.property('user')
      .to.be.deep.eq({
        ...expectedUserData,
        id: user.id.toString(),
      });

    const tokenExpiresAt = new Date(verifiedToken.exp * 1000);

    const afterTokenExpires = new Date((verifiedToken.exp - 1) * 1000);

    const isTokenExpired = tokenExpiresAt < afterTokenExpires;

    expect(isTokenExpired).to.be.eq(false);
  });

  it('Should not validate jwt token after expiration time', async () => {
    const request = QueryUserLoginMutation({
      email: sampleUsers[0].email,
      password: sampleUsers[0].password,
      rememberMe: false,
    });

    const { body } = await supertest(baseURL).post('').send(request);
    const response = body.data.login;

    const verifiedToken = await jwtProvider.verify(response.token);

    const tokenExpiresAt = new Date(verifiedToken.exp * 1000);

    const afterTokenExpires = new Date((verifiedToken.exp + 1) * 1000);

    const isTokenExpired = tokenExpiresAt < afterTokenExpires;

    expect(isTokenExpired).to.be.eql(true);
  });
});
