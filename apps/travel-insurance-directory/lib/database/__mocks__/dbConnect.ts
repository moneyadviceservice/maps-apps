/**
 * Manual mock for `lib/database/dbConnect` — used when tests call
 * `jest.mock('lib/database/dbConnect')`.
 *
 * Exposes spies for `container.items.query` / `fetchAll` used by firm Cosmos helpers.
 */
export const cosmosDbItemsQueryMock = {
  fetchAll: jest.fn(),
  query: jest.fn(),
};

cosmosDbItemsQueryMock.query.mockReturnValue({
  fetchAll: cosmosDbItemsQueryMock.fetchAll,
});

export async function dbConnect() {
  return {
    client: {} as import('@azure/cosmos').CosmosClient,
    database: {} as import('@azure/cosmos').Database,
    container: {
      items: {
        query: (...args: unknown[]) => cosmosDbItemsQueryMock.query(...args),
      },
    },
  };
}

export function resetCosmosDbItemsQueryMock() {
  jest.clearAllMocks();
  cosmosDbItemsQueryMock.query.mockReturnValue({
    fetchAll: cosmosDbItemsQueryMock.fetchAll,
  });
}
