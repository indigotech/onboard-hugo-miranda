import { testConfig } from '@config/test';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { HashProvider } from 'src/typeorm/entities/users/providers/hash-provider/hash-provider';
import { User } from 'src/typeorm/entities/users/user-entity';
import supertest from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { QueryUserLoginMutation } from './request-builder';

const baseURL = testConfig.baseURL;
const sampleUsers = testConfig.samples.users;
let usersRepository: Repository<User>;
let hashProvider: HashProvider;

describe('E2E GraphQL - User - Mutation:Login', () => {
  beforeEach(async () => {
    usersRepository = getRepository(User);
    hashProvider = new HashProvider();
    const password = await hashProvider.generate(sampleUsers[0].password);

    await usersRepository.save({ ...sampleUsers[0], password });
  });

  afterEach(async () => await usersRepository.delete({}));

  it('Should not login without email or password.', async () => {
    const request = QueryUserLoginMutation({ email: '', password: '' });

    const { body } = await supertest(baseURL).post('').send(request);

    expect(body.errors).to.have.lengthOf.least(1);

    expect(body.errors[0]).to.have.property('message').eql('Unauthorized. Possible invalid credentials.');

    expect(body.errors[0].extensions.exception)
      .to.have.property('additionalInfo')
      .to.be.eql('Email or Password is null.');

    expect(body.errors[0].extensions.exception).to.have.property('code').eq(401);

    expect(body).to.have.nested.property('data').to.be.null;
  });

  it('Should not login with invalid email.', async () => {
    const request = QueryUserLoginMutation({ email: 'invalid Email Input', password: 'invalid Password' });

    const { body } = await supertest(baseURL).post('').send(request);

    expect(body.errors).to.have.lengthOf.least(1);

    expect(body.errors[0]).to.have.property('message').eql('Unauthorized. Possible invalid credentials.');

    expect(body.errors[0].extensions.exception).to.have.property('additionalInfo').to.be.eql('Invalid email format.');

    expect(body.errors[0].extensions.exception).to.have.property('code').eq(401);

    expect(body).to.have.nested.property('data').to.be.null;
  });

  it('Should not login if user does not exist.', async () => {
    const request = QueryUserLoginMutation({ email: 'InvalidUser@Email.com', password: 'invalid Password' });

    const { body } = await supertest(baseURL).post('').send(request);

    expect(body.errors).to.have.lengthOf.least(1);

    expect(body.errors[0]).to.have.property('message').eql('Unauthorized. Possible invalid credentials.');

    expect(body.errors[0].extensions.exception).to.have.property('additionalInfo').to.be.eql('User not found.');

    expect(body.errors[0].extensions.exception).to.have.property('code').eq(401);

    expect(body).to.have.nested.property('data').to.be.null;
  });

  it('Should not login if password does not match.', async () => {
    const request = QueryUserLoginMutation({ email: sampleUsers[0].email, password: 'invalid Password' });

    const { body } = await supertest(baseURL).post('').send(request);

    expect(body.errors).to.have.lengthOf.least(1);

    expect(body.errors[0]).to.have.property('message').eql('Unauthorized. Possible invalid credentials.');

    expect(body.errors[0].extensions.exception)
      .to.have.property('additionalInfo')
      .to.be.eql('Password does not match.');

    expect(body.errors[0].extensions.exception).to.have.property('code').eq(401);

    expect(body).to.have.nested.property('data').to.be.null;
  });
});
