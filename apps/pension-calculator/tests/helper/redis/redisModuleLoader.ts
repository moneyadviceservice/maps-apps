export async function loadModule() {
  const { redisRestGet, redisRestSet } = await import(
    '@maps-react/redis/rest-client'
  );

  return {
    mockedGet: redisRestGet as jest.MockedFunction<typeof redisRestGet>,
    mockedSet: redisRestSet as jest.MockedFunction<typeof redisRestSet>,
  };
}
