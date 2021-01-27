import { testConfig } from '@config/test';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { HashProvider } from 'src/typeorm/entities/users/providers/hash-provider/hash-provider';
import { User } from 'src/typeorm/entities/users/user-entity';
import supertest from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { QueryUserLoginMutation, QueryUserListQuery } from './request-builder';
import { userSeeds } from '../db/user.seeds';

const baseURL = testConfig.baseURL;
let usersRepository: Repository<User>;
let users = [];
let hashProvider: HashProvider;
let token: string;

const cutIntoPages = (array: User[], pagesNum: number, limitPerPage: number) => {
  const pagedUsers = [];
  for (let iPage = 1; iPage <= pagesNum; iPage++) {
    pagedUsers.push(array.slice((iPage - 1) * limitPerPage, iPage * limitPerPage));
  }
  return pagedUsers;
};

describe('E2E GraphQL - User - Query:List', () => {
  beforeEach(async () => {
    usersRepository = getRepository(User);
    await userSeeds();

    hashProvider = new HashProvider();
    const password = await hashProvider.generate('passw0rd');

    await usersRepository.save({
      name: 'admin',
      email: 'admin@gmail.com',
      birthDate: '01/01/2000',
      cpf: '12312312312',
      password,
    });

    const loginRequest = QueryUserLoginMutation({
      email: 'admin@gmail.com',
      password: 'passw0rd',
    });

    const dbUsers = await usersRepository.find({
      select: ['id', 'name', 'email', 'cpf', 'birthDate'],
      order: { name: 'ASC' },
    });

    users = dbUsers.map((user) => ({ ...user, id: user.id.toString() }));

    const { body: loginBody } = await supertest(baseURL).post('').send(loginRequest);
    token = loginBody.data.login.token;
  });

  afterEach(async () => await usersRepository.delete({}));

  it('Should not list with empty token', async () => {
    token = '';
    const request = QueryUserListQuery({});

    const { body } = await supertest(baseURL).post('').set('Authorization', `Bearer ${token}`).send(request);

    expect(body.errors).to.be.lengthOf.least(1);
    expect(body.errors[0].message).to.be.eq('Context creation failed: jwt must be provided');
  });

  it('Should not list with null or undefined token', async () => {
    token = null;
    const request = QueryUserListQuery({});

    const { body } = await supertest(baseURL).post('').set('Authorization', `Bearer ${token}`).send(request);

    expect(body.errors).to.be.lengthOf.least(1);
    expect(body.errors[0].message).to.be.eq('Context creation failed: jwt malformed');
  });

  it('Should not list with invalid signature token', async () => {
    token = `${token}a`;
    const request = QueryUserListQuery({});

    const { body } = await supertest(baseURL).post('').set('Authorization', `Bearer ${token}`).send(request);

    expect(body.errors).to.be.lengthOf.least(1);
    expect(body.errors[0].message).to.be.eq('Context creation failed: invalid signature');
  });

  it('Should be list all users with default pagination and ordered alphabetically', async () => {
    const [limit, page] = [20, 1];
    const responses = [];
    let request = QueryUserListQuery({ limit, page });
    const { body } = await supertest(baseURL).post('').set('Authorization', `Bearer ${token}`).send(request);
    const { pages } = body.data.list.info;
    responses.push(body.data.list);

    for (let currentPage = 2; currentPage <= pages; currentPage++) {
      request = QueryUserListQuery({ limit, page: currentPage });
      const { body } = await supertest(baseURL).post('').set('Authorization', `Bearer ${token}`).send(request);
      responses.push(body.data.list);
    }

    const pagedUsers = cutIntoPages(users, pages, limit);

    expect(responses[0].info.page).to.be.equal(1);
    expect(responses[0].users).to.be.deep.equal(pagedUsers[0]);

    expect(responses[1].info.page).to.be.equal(2);
    expect(responses[1].users).to.be.deep.equal(pagedUsers[1]);

    expect(responses[2].info.page).to.be.equal(3);
    expect(responses[2].users).to.be.deep.equal(pagedUsers[2]);
  });

  it('Should be list all users with custom pagination and ordered alphabetically', async () => {
    const [limit, page] = [40, 1];
    const responses = [];
    let request = QueryUserListQuery({ limit, page });
    const { body } = await supertest(baseURL).post('').set('Authorization', `Bearer ${token}`).send(request);
    const { pages } = body.data.list.info;
    responses.push(body.data.list);

    for (let currentPage = 2; currentPage <= pages; currentPage++) {
      request = QueryUserListQuery({ limit, page: currentPage });
      const { body } = await supertest(baseURL).post('').set('Authorization', `Bearer ${token}`).send(request);
      responses.push(body.data.list);
    }

    const pagedUsers = cutIntoPages(users, pages, limit);

    expect(responses[0].info.page).to.be.equal(1);
    expect(responses[0].users).to.be.deep.equal(pagedUsers[0]);

    expect(responses[1].info.page).to.be.equal(2);
    expect(responses[1].users).to.be.deep.equal(pagedUsers[1]);
  });
});
