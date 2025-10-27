import { CosmosClient } from '@azure/cosmos';

import * as connectToDb from './dbConnect';

const { dbConnect } = connectToDb;

jest.mock('@azure/cosmos', () => {
  return {
    CosmosClient: jest.fn().mockImplementation(() => ({
      database: jest.fn().mockReturnValue({
        container: jest.fn().mockReturnValue({
          id: 'test-container',
          items: [],
        }),
        id: 'test-database',
      }),
    })),
    Container: jest.fn(),
    Database: jest.fn(),
  };
});

describe('dbConnect', () => {
  const mockClient = {
    database: jest.fn().mockReturnValue({
      container: jest.fn().mockReturnValue({
        id: 'test-container',
      }),
      id: 'test-database',
    }),
  };

  const mockDatabase = {
    id: 'test-database',
  };

  const mockContainer = {
    id: 'test-container',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.DB_CONNECTION_STRING = 'fake_connection_string';
    process.env.SFS_DB_DATABASE_ID = 'fake_database_id';
    process.env.SFS_DB_CONTAINER_ID = 'fake_container_id';
  });

  it('should throw an error if required environment variables are missing', async () => {
    delete process.env.DB_CONNECTION_STRING;
    delete process.env.SFS_DB_DATABASE_ID;
    delete process.env.SFS_DB_CONTAINER_ID;

    await expect(dbConnect()).rejects.toThrowError(
      'Missing environment variables: DB_CONNECTION_STRING, SFS_DB_DATABASE_ID, SFS_DB_CONTAINER_ID',
    );
  });

  it('should successfully connect to the database and return client, database, and container', async () => {
    (CosmosClient as jest.Mock).mockImplementationOnce(() => mockClient);

    const result = await dbConnect();

    expect(result.client).toEqual(mockClient);
    expect(result.database.id).toEqual(mockDatabase.id);
    expect(result.container.id).toEqual(mockContainer.id);

    expect(mockClient.database).toHaveBeenCalledWith('fake_database_id');
    expect(mockClient.database().container).toHaveBeenCalledWith(
      'fake_container_id',
    );
  });

  it('should throw an error when CosmosClient connection fails', async () => {
    (CosmosClient as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Connection failed');
    });

    await expect(dbConnect()).rejects.toThrowError(
      'Failed to connect to the database: Connection failed',
    );
  });
});
