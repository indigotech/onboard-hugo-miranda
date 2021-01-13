import '@config/env';
import { describe, it } from 'mocha';
import { runServer } from 'src/server';
import supertest from 'supertest';

let baseURL: string;

before(async () => {
  await runServer();
  baseURL = 'http://localhost:4000/graphql';
});

describe('Testing GraphQL - Hello', () => {
  it('Should perform a successful request to Graphql endpoint - Hello', async () => {
    const request = {
      query: `{ hello }`,
    };

    const { body } = await supertest(baseURL).post('').send(request);

    console.log(body);
  });
});
