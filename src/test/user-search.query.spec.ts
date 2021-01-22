import { testConfig } from '@config/test';
import { expect } from 'chai';
import { HashProvider } from 'src/typeorm/entities/users/providers/hash-provider/hash-provider';
import { User } from 'src/typeorm/entities/users/user-entity';
import { FormatCpf } from 'src/utils';
import supertest from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { QueryUserSearchQuery } from './request-builder';

const baseURL = testConfig.baseURL;
const sampleUsers = testConfig.samples.users;
let hashProvider: HashProvider;
let usersRepository: Repository<User>;
let insertedUsers: User[];

describe('E2E GraphQL - User - Query:Search', () => {
  beforeEach(async () => {
    hashProvider = new HashProvider();
    usersRepository = getRepository(User);

    const cpfs = [FormatCpf(sampleUsers[0].cpf), FormatCpf(sampleUsers[1].cpf), FormatCpf(sampleUsers[2].cpf)];
    const passwords = [
      await hashProvider.generate(sampleUsers[0].password),
      await hashProvider.generate(sampleUsers[1].password),
      await hashProvider.generate(sampleUsers[2].password),
    ];

    insertedUsers = await usersRepository.save([
      { ...sampleUsers[0], cpf: cpfs[0], password: passwords[0] },
      { ...sampleUsers[1], cpf: cpfs[1], password: passwords[1] },
      { ...sampleUsers[2], cpf: cpfs[2], password: passwords[2] },
    ]);
  });

  afterEach(async () => {
    await usersRepository.delete({});
  });

  it('Should search and find 3 users (1 by 1)', async () => {
    let request = QueryUserSearchQuery({ id: insertedUsers[0].id });
    let { body } = await supertest(baseURL).post('').send(request);

    expect(body.data.userSearch.user).to.be.deep.equal({
      id: insertedUsers[0].id.toString(),
      name: sampleUsers[0].name,
      email: sampleUsers[0].email,
      birthDate: sampleUsers[0].birthDate,
      cpf: FormatCpf(sampleUsers[0].cpf),
    });

    request = QueryUserSearchQuery({ id: insertedUsers[1].id });
    body = (await supertest(baseURL).post('').send(request)).body;

    expect(body.data.userSearch.user).to.be.deep.equal({
      id: insertedUsers[1].id.toString(),
      name: sampleUsers[1].name,
      email: sampleUsers[1].email,
      birthDate: sampleUsers[1].birthDate,
      cpf: FormatCpf(sampleUsers[1].cpf),
    });

    request = QueryUserSearchQuery({ id: insertedUsers[2].id });
    body = (await supertest(baseURL).post('').send(request)).body;

    expect(body.data.userSearch.user).to.be.deep.equal({
      id: insertedUsers[2].id.toString(),
      name: sampleUsers[2].name,
      email: sampleUsers[2].email,
      birthDate: sampleUsers[2].birthDate,
      cpf: FormatCpf(sampleUsers[2].cpf),
    });
  });

  it('Should return error when search a inexistent user', async () => {
    const request = QueryUserSearchQuery({ id: -1 });
    const { body } = await supertest(baseURL).post('').send(request);
    const error = body.errors[0];

    expect(body.errors).to.have.lengthOf.least(1);
    expect(error).to.have.property('message').equal('Cannot find this user');
    expect(error.extensions.exception).to.have.property('code').equal(400);
    expect(error.extensions.exception).to.have.property('additionalInfo').equal(`User ${-1} could not be found.`);
  });
});
