import '@config/env';
import { testConfig } from '@config/test';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { runServer } from 'src/server';
import supertest from 'supertest';

const baseURL = testConfig.baseURL;

before(async () => {
  await runServer();
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

require('./user-login.mutation.spec');
require('./user-login-jwt.spec');
require('./user-register.mutation.spec');
require('./user-search.query.spec');
