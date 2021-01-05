var { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => 'Hello, world!',
}

async function queryHello() {
  const queryResponse = await graphql(schema, '{ hello }', root);
  console.log(queryResponse);
}

queryHello();
