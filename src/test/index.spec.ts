import '@config/env';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { runServer } from 'src/server';
import supertest from 'supertest';

let baseURL: string;

before(async () => {
  await runServer();
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

    expect(data.hello).to.be.eq('hello, world!');
  });
});
