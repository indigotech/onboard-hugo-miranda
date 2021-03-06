import { testConfig } from '@config/test';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { HashProvider } from 'src/typeorm/entities/users/providers/hash-provider/hash-provider';
import { User } from 'src/typeorm/entities/users/user-entity';
import supertest from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { QueryUserLoginMutation, QueryUserRegisterMutation } from './request-builder';

const baseURL = testConfig.baseURL;
const sampleUsers = testConfig.samples.users;
let usersRepository: Repository<User>;
let hashProvider: HashProvider;
let token;

const expectedUserData = {
  name: sampleUsers[1].name,
  email: sampleUsers[1].email,
  birthDate: sampleUsers[1].birthDate,
  cpf: sampleUsers[1].cpf,
};

describe('E2E GraphQL - User - Mutation:Register', () => {
  beforeEach(async () => {
    usersRepository = getRepository(User);
    hashProvider = new HashProvider();
    const password = await hashProvider.generate(sampleUsers[0].password);

    await usersRepository.save({
      ...sampleUsers[0],
      password,
    });

    const loginRequest = QueryUserLoginMutation({
      email: sampleUsers[0].email,
      password: sampleUsers[0].password,
    });
    const { body: loginBody } = await supertest(baseURL).post('').send(loginRequest);
    token = loginBody.data.login.token;
  });

  afterEach(async () => await usersRepository.delete({}));

  it('Should not register with empty token', async () => {
    token = '';
    const registerRequest = QueryUserRegisterMutation(sampleUsers[1]);

    const { body } = await supertest(baseURL).post('').set('Authorization', `Bearer ${token}`).send(registerRequest);

    expect(body.errors).to.be.lengthOf.least(1);
    expect(body.errors[0].message).to.be.eq('Context creation failed: jwt must be provided');
  });

  it('Should not register with null or undefined token', async () => {
    token = null;
    const registerRequest = QueryUserRegisterMutation(sampleUsers[1]);

    const { body } = await supertest(baseURL).post('').set('Authorization', `Bearer ${token}`).send(registerRequest);

    expect(body.errors).to.be.lengthOf.least(1);
    expect(body.errors[0].message).to.be.eq('Context creation failed: jwt malformed');
  });

  it('Should not register with invalid signature token', async () => {
    token = `${token}a`;
    const registerRequest = QueryUserRegisterMutation(sampleUsers[1]);

    const { body } = await supertest(baseURL).post('').set('Authorization', `Bearer ${token}`).send(registerRequest);

    expect(body.errors).to.be.lengthOf.least(1);
    expect(body.errors[0].message).to.be.eq('Context creation failed: invalid signature');
  });

  it('Should not register with any invalid data', async () => {
    const registerRequest = QueryUserRegisterMutation({ name: '', cpf: '', birthDate: '', email: '', password: '' });

    const { body } = await supertest(baseURL).post('').set('Authorization', `Bearer ${token}`).send(registerRequest);

    expect(body.errors).to.be.lengthOf.least(1);
    expect(body.errors[0].message).to.be.eq('Register could not be done.');
    expect(body.errors[0].extensions.exception.code).to.be.eq(400);
    expect(body.errors[0].extensions.exception.additionalInfo).to.be.eq(
      'Verify if all fields are filled with valid data.',
    );
  });

  it('Should perform a successful registration', async () => {
    const registerRequest = QueryUserRegisterMutation(sampleUsers[1]);

    const { body } = await supertest(baseURL).post('').set('Authorization', `Bearer ${token}`).send(registerRequest);

    const count = await usersRepository.count();
    const insertedUser = await usersRepository.findOne({ email: sampleUsers[1].email });
    const validPassword = await hashProvider.verify(sampleUsers[1].password, insertedUser.password);

    expect(body.data.register.user).to.be.deep.equal({
      id: body.data.register.user.id,
      ...expectedUserData,
    });
    expect(count).to.be.eq(2);
    expect(insertedUser).to.be.deep.equal({
      ...expectedUserData,
      id: Number(body.data.register.user.id),
      password: insertedUser.password,
    });
    expect(validPassword).to.be.true;
  });
});
