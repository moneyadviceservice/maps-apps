import { CosmosClient } from '@azure/cosmos';
import { connectToDatabase } from './dbConnect';

// Mock the CosmosClient and its methods
jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn().mockImplementation(function (this: any) {
    this.database = jest.fn().mockReturnValue({
      container: jest.fn().mockReturnValue({}),
    });
  }),
}));

describe('connectToDatabase', () => {
  const originalEnv = process.env;
  const missingEnvError =
    'DB_CONNECTION_STRING, BUDGET_PLANNER_DB_DATABASE_ID, or BUDGET_PLANNER_DB_CONTAINER_ID is not defined in the environment variables';

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const setEnvVars = (
    connectionString?: string,
    databaseId?: string,
    containerId?: string,
  ) => {
    process.env.DB_CONNECTION_STRING = connectionString;
    process.env.BUDGET_PLANNER_DB_DATABASE_ID = databaseId;
    process.env.BUDGET_PLANNER_DB_CONTAINER_ID = containerId;
  };

  it('successfully connects to the database', async () => {
    setEnvVars(
      'mock_connection_string',
      'mock_database_id',
      'mock_container_id',
    );

    const result = await connectToDatabase();

    expect(result.client).toBeTruthy();
    expect(result.client).toBeInstanceOf(CosmosClient);
    expect(result.database).toBeTruthy();
    expect(result.container).toBeTruthy();
    expect(CosmosClient).toHaveBeenCalledWith('mock_connection_string');
  });

  it('successfully connects to the database with different environment variables', async () => {
    setEnvVars(
      'another_mock_connection_string',
      'another_mock_database_id',
      'another_mock_container_id',
    );

    const result = await connectToDatabase();

    expect(result.client).toBeTruthy();
    expect(result.client).toBeInstanceOf(CosmosClient);
    expect(result.database).toBeTruthy();
    expect(result.container).toBeTruthy();
    expect(CosmosClient).toHaveBeenCalledWith('another_mock_connection_string');
  });

  test.each([
    [
      'DB_CONNECTION_STRING',
      undefined,
      'mock_database_id',
      'mock_container_id',
    ],
    [
      'BUDGET_PLANNER_DB_DATABASE_ID',
      'mock_connection_string',
      undefined,
      'mock_container_id',
    ],
    [
      'BUDGET_PLANNER_DB_CONTAINER_ID',
      'mock_connection_string',
      'mock_database_id',
      undefined,
    ],
  ])(
    'throws an error when %s is not set',
    async (_, connectionString, databaseId, containerId) => {
      setEnvVars(connectionString, databaseId, containerId);

      await expect(connectToDatabase()).rejects.toThrow(missingEnvError);
    },
  );

  it('throws an error when connection fails', async () => {
    setEnvVars(
      'mock_connection_string',
      'mock_database_id',
      'mock_container_id',
    );

    (CosmosClient as jest.Mock).mockImplementation(() => {
      throw new Error('Connection failed');
    });

    await expect(connectToDatabase()).rejects.toThrow(
      'Failed to connect to the database',
    );
  });

  it('logs an error when connection fails', async () => {
    setEnvVars(
      'mock_connection_string',
      'mock_database_id',
      'mock_container_id',
    );

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    (CosmosClient as jest.Mock).mockImplementation(() => {
      throw new Error('Connection failed');
    });

    await expect(connectToDatabase()).rejects.toThrow(
      'Failed to connect to the database',
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error connecting to the database:',
      'Connection failed',
    );

    consoleErrorSpy.mockRestore();
  });
});
