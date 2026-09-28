import { CosmosClient } from '@azure/cosmos';

import { dbConnect } from './dbConnect';

const mockContainer = {};
const mockDatabase = {
  container: jest.fn().mockReturnValue(mockContainer),
};
const mockClient = {
  database: jest.fn().mockReturnValue(mockDatabase),
};

jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn().mockImplementation(() => mockClient),
}));

const originalEnv = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('dbConnect', () => {
  it('returns client, database and container when all env vars are set', async () => {
    process.env.DB_CONNECTION_STRING = 'AccountEndpoint=...';
    process.env.DB_DATABASE_ID = 'test-db';
    process.env.DB_CONTAINER_ID = 'test-container';

    const result = await dbConnect();

    expect(result).toEqual({
      client: mockClient,
      database: mockDatabase,
      container: mockContainer,
    });
    expect(mockClient.database).toHaveBeenCalledWith('test-db');
    expect(mockDatabase.container).toHaveBeenCalledWith('test-container');
  });

  it('throws when DB_CONNECTION_STRING is missing', async () => {
    delete process.env.DB_CONNECTION_STRING;
    process.env.DB_DATABASE_ID = 'test-db';
    process.env.DB_CONTAINER_ID = 'test-container';

    await expect(dbConnect()).rejects.toThrow(
      'Missing environment variables: DB_CONNECTION_STRING',
    );
  });

  it('throws when DB_DATABASE_ID is missing', async () => {
    process.env.DB_CONNECTION_STRING = 'AccountEndpoint=...';
    delete process.env.DB_DATABASE_ID;
    process.env.DB_CONTAINER_ID = 'test-container';

    await expect(dbConnect()).rejects.toThrow(
      'Missing environment variables: DB_DATABASE_ID',
    );
  });

  it('throws when DB_CONTAINER_ID is missing', async () => {
    process.env.DB_CONNECTION_STRING = 'AccountEndpoint=...';
    process.env.DB_DATABASE_ID = 'test-db';
    delete process.env.DB_CONTAINER_ID;

    await expect(dbConnect()).rejects.toThrow(
      'Missing environment variables: DB_CONTAINER_ID',
    );
  });

  it('throws with all missing env vars listed when multiple are missing', async () => {
    delete process.env.DB_CONNECTION_STRING;
    delete process.env.DB_DATABASE_ID;
    delete process.env.DB_CONTAINER_ID;

    await expect(dbConnect()).rejects.toThrow(
      'Missing environment variables: DB_CONNECTION_STRING, DB_DATABASE_ID, DB_CONTAINER_ID',
    );
  });

  it('throws when CosmosClient throws', async () => {
    (CosmosClient as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Connection refused');
    });
    process.env.DB_CONNECTION_STRING = 'AccountEndpoint=...';
    process.env.DB_DATABASE_ID = 'test-db';
    process.env.DB_CONTAINER_ID = 'test-container';

    await expect(dbConnect()).rejects.toThrow(
      'Failed to connect to the database: Connection refused',
    );
  });

  it('throws with "Unknown error" when thrown value has no message', async () => {
    (CosmosClient as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Failed to connect to the database: Unknown error');
    });
    process.env.DB_CONNECTION_STRING = 'AccountEndpoint=...';
    process.env.DB_DATABASE_ID = 'test-db';
    process.env.DB_CONTAINER_ID = 'test-container';

    await expect(dbConnect()).rejects.toThrow(
      'Failed to connect to the database: Unknown error',
    );
  });
});
