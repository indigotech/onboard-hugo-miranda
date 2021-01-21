interface ITestConfig {
  baseURL: string;
}

export const testConfig: ITestConfig = {
  baseURL: `http://localhost:${process.env.SERVER_PORT}/graphql`,
};
