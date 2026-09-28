import { databaseClient } from './databaseClient';

const RESPONSE = [
  {
    id: '123',
    urn: 'W123DI',
    url: 'https://localhost:8081/client-summary?version=1.0&t1=1&t2=2&t3=3',
  },
  {
    id: '124',
    urn: 'W124DI',
    url: 'https://localhost:8081/client-summary?version=1.0&t1=0&t2=2&t3=1',
  },
];

const USER_DATA = {
  id: '123',
  urn: 'WFHJ567',
  url: 'https://localhost:8081/client-summary?version=1&t1=4&task=5&t1q1=3&t1q2=3&t2=4&t2q1=2&t2q2=2&t2q3=1&t3=4&t3q1=3&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2',
};

let mockContainer = jest.fn();

jest.mock('@azure/cosmos', () => {
  return {
    CosmosClient: jest.fn().mockImplementation(() => {
      return {
        database: jest.fn().mockImplementation(() => {
          return {
            container: mockContainer,
          };
        }),
      };
    }),
  };
});

describe('databaseClient', () => {
  beforeEach(() => {
    process.env.DB_ENDPOINT = 'https://localhost:8081';
    mockContainer = jest.fn().mockImplementation(() => {
      return {
        item: jest.fn().mockImplementation(() => {
          return {
            replace: jest.fn().mockResolvedValue(USER_DATA),
          };
        }),
        items: {
          create: jest.fn().mockResolvedValue(USER_DATA),
          query: jest.fn().mockImplementationOnce(() => {
            return {
              fetchAll: jest.fn().mockResolvedValue({
                resources: Array(RESPONSE[0]),
              }),
            };
          }),
        },
      };
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should connect to the database and return the container', async () => {
    const client = await databaseClient('pensionwise-appointments', 'data');
    expect(client.container).toBeDefined();
  });

  it('should fail to connect to the database', async () => {
    const ERROR_MESSAGE = '500: Connection failed';
    mockContainer = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });

    await expect(
      databaseClient('pensionwise-appointments', 'data'),
    ).rejects.toThrow(
      new Error('Error connecting to database: ' + 'Error: ' + ERROR_MESSAGE),
    );
  });

  it('should throw error when databaseID or containerID is empty', async () => {
    const ERROR_MESSAGE = 'Database ID and container ID must be defined';
    await expect(databaseClient('', '')).rejects.toThrow(ERROR_MESSAGE);
  });

  it('should throw error when endpoint is not defined', async () => {
    const ERROR_MESSAGE = 'Database connection string must be defined';
    process.env.DB_ENDPOINT = '';
    await expect(
      databaseClient('pensionwise-appointments', 'data'),
    ).rejects.toThrow(ERROR_MESSAGE);
  });

  it('should insert an item to the database', async () => {
    const client = await databaseClient('pensionwise-appointments', 'data');

    const data = await client.insertItemToDatabase(USER_DATA);

    expect(data).toBeDefined();
    expect(data).toEqual(USER_DATA);
  });

  it('should search database by id', async () => {
    const client = await databaseClient('pensionwise-appointments', 'data');

    const data = await client.searchById('W123DI');
    expect(data).toBeDefined();
    expect(data).toEqual(RESPONSE[0]);
  });

  it('should search database by id throw an error when id is undefined', async () => {
    const client = await databaseClient('pensionwise-appointments', 'data');

    await expect(client.searchById('')).rejects.toThrow('ID must be defined');
  });

  it('should update an item in the database', async () => {
    const client = await databaseClient('pensionwise-appointments', 'data');

    expect(client.container).toBeDefined();

    const data = await client.updateItemInDatabase(USER_DATA);

    expect(data).toBe(USER_DATA);
  });
});
