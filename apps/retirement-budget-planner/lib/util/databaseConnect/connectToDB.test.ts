import { databaseClient } from './connectToDB';

let mockDatabase = jest.fn();
jest.mock('@azure/cosmos', () => {
  return {
    CosmosClient: jest.fn().mockImplementation(() => ({
      database: mockDatabase,
    })),
  };
});

describe('Connect to Cosmos database', () => {
  beforeEach(() => {
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      COSMOS_DB_CONECTION_STRING: 'connection-string',
      COSMOS_DB_DATABASE_ID: 'database-id',
      COSMOS_DB_CONTAINER_ID: 'container-id',
    };
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });
  it('should connect to database', async () => {
    const mockContainer = jest.fn();
    mockDatabase.mockImplementation(() => ({
      container: mockContainer,
    }));
    await databaseClient();
    expect(mockContainer).toHaveBeenCalled();
  });

  it('should throw error if it fails to connect to the database', async () => {
    const ERROR_MESSAGE = '500: Connection failed';
    mockDatabase = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });

    await expect(() => databaseClient()).rejects.toThrow();
  });

  it('should throw an error if database id is empty', async () => {
    process.env.COSMOS_DB_DATABASE_ID = '';

    await expect(() => databaseClient()).rejects.toThrow(
      'Database ID and container ID must be defined',
    );
  });

  it('should throw an error if container id is empty', async () => {
    process.env.COSMOS_DB_CONTAINER_ID = '';

    await expect(() => databaseClient()).rejects.toThrow(
      'Database ID and container ID must be defined',
    );
  });

  it('should throw an error if endpoint is empty', async () => {
    process.env.COSMOS_DB_CONECTION_STRING = '';

    await expect(() => databaseClient()).rejects.toThrow(
      'Database connection string must be defined',
    );
  });
});
