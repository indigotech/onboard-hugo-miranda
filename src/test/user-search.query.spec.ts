import { testConfig } from '@config/test';
import { expect } from 'chai';
import { HashProvider } from 'src/typeorm/entities/users/providers/hash-provider/hash-provider';
import { User } from 'src/typeorm/entities/users/user-entity';
import { formatCpf } from 'src/utils';
import supertest from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { QueryUserSearchQuery } from './request-builder';

const baseURL = testConfig.baseURL;
const sampleUsers = testConfig.samples.users;
let hashProvider: HashProvider;
let usersRepository: Repository<User>;
let insertedUser: User;

describe('E2E GraphQL - User - Query:Search', () => {
  beforeEach(async () => {
    hashProvider = new HashProvider();
    usersRepository = getRepository(User);

    const cpf = formatCpf(sampleUsers[0].cpf);
    const password = await hashProvider.generate(sampleUsers[0].password);

    insertedUser = await usersRepository.save({ ...sampleUsers[0], cpf, password });
  });

  afterEach(async () => {
    await usersRepository.delete({});
  });

  it('Should search and find a users', async () => {
    const request = QueryUserSearchQuery({ id: insertedUser.id });
    const { body } = await supertest(baseURL).post('').send(request);

    expect(body.data.userSearch.user).to.be.deep.equal({
      id: insertedUser.id.toString(),
      name: sampleUsers[0].name,
      email: sampleUsers[0].email,
      birthDate: sampleUsers[0].birthDate,
      cpf: formatCpf(sampleUsers[0].cpf),
    });
  });

  it('Should return error when search a inexistent user', async () => {
    const request = QueryUserSearchQuery({ id: -1 });
    const { body } = await supertest(baseURL).post('').send(request);
    const error = body.errors[0];

    expect(body.errors).to.have.lengthOf.least(1);
    expect(error).to.have.property('message').equal('Cannot find this user');
    expect(error.extensions.exception).to.have.property('code').equal(404);
    expect(error.extensions.exception).to.have.property('additionalInfo').equal(`User ${-1} could not be found.`);
  });
});
