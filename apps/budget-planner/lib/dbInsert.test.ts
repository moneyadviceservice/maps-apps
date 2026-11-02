import { Container } from '@azure/cosmos';
import { connectToDatabase } from './dbConnect';
import { insertBudgetData } from './dbInsert';

// Mock the connectToDatabase function
jest.mock('./dbConnect', () => ({
  connectToDatabase: jest.fn(),
}));

describe('dbInsert', () => {
  let mockContainer: jest.Mocked<Container>;

  const createMockData = (
    pay: string,
    payFrequency: 'monthly' | 'weekly' | 'biweekly',
  ) => ({
    sessionId: 'test-session-id',
    emailHash: 'test-email-hash',
    lastAccessed: new Date(),
    income: { pay, pay_frequency: payFrequency },
    'household-bills': {},
    'living-costs': {},
    'finance-insurance': {},
    'family-friends': {},
    travel: {},
    leisure: {},
  });

  const mockInsert = (mockData: any) => {
    const mockInsertedItem = { id: 'test-id', ...mockData };
    (mockContainer.items.create as jest.Mock).mockResolvedValue({
      resource: mockInsertedItem,
    });
    return mockInsertedItem;
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockContainer = {
      items: {
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<Container>;

    (connectToDatabase as jest.Mock).mockResolvedValue({
      container: mockContainer,
    });
  });

  describe('insertBudgetData', () => {
    it('successfully inserts valid budget data', async () => {
      const mockData = createMockData('3000', 'monthly');
      const mockInsertedItem = mockInsert(mockData);

      const result = await insertBudgetData(mockData);

      expect(result).toEqual(mockInsertedItem);
      expect(mockContainer.items.create).toHaveBeenCalledWith(mockData);
    });

    it('throws an error for invalid budget data', async () => {
      const invalidData = {
        sessionId: 123, // Invalid: should be a string
        lastAccessed: 'not-a-date', // Invalid: should be a Date object
      };

      await expect(insertBudgetData(invalidData as any)).rejects.toThrow(
        'Budget data is invalid',
      );
    });

    it('throws an error when database insertion fails', async () => {
      const mockData = createMockData('3000', 'monthly');
      (mockContainer.items.create as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(insertBudgetData(mockData)).rejects.toThrow(
        'Failed to insert data into the database: Database error',
      );
    });

    it.each([
      ['weekly', '1500'],
      ['biweekly', '3000'],
    ])(
      'successfully inserts budget data with %s pay frequency',
      async (payFrequency, pay) => {
        const mockData = createMockData(
          pay,
          payFrequency as 'weekly' | 'biweekly',
        );
        const mockInsertedItem = mockInsert(mockData);

        const result = await insertBudgetData(mockData);

        expect(result).toEqual(mockInsertedItem);
        expect(mockContainer.items.create).toHaveBeenCalledWith(mockData);
      },
    );

    it('throws an error when sessionId is missing', async () => {
      const invalidData = {
        sessionId: '', // Invalid: should not be empty
        lastAccessed: new Date(),
        income: { pay: '3000', pay_frequency: 'monthly' as const },
        'household-bills': {},
        'living-costs': {},
        travel: {},
        leisure: {},
      };

      await expect(insertBudgetData(invalidData as any)).rejects.toThrow(
        'Budget data is invalid',
      );
    });

    it('throws an error when lastAccessed is not a Date object', async () => {
      const invalidData = {
        sessionId: 'test-session-id',
        emailHash: 'test-email-hash',
        lastAccessed: 'not-a-date', // Invalid: should be a Date object
        income: { pay: '3000', pay_frequency: 'monthly' as const },
        'household-bills': {},
        'living-costs': {},
        travel: {},
        leisure: {},
        'finance-insurance': {},
        'family-friends': {},
      };

      await expect(insertBudgetData(invalidData as any)).rejects.toThrow(
        'Budget data is invalid',
      );
    });
    it('throws an error when emailHash is missing', async () => {
      const invalidData = {
        sessionId: 'test-session-id',
        emailHash: '', // Invalid: should not be empty
        lastAccessed: new Date(),
        income: { pay: '3000', pay_frequency: 'monthly' as const },
        'household-bills': {},
        'living-costs': {},
        'finance-insurance': {},
        'family-friends': {},
        travel: {},
        leisure: {},
      };

      await expect(insertBudgetData(invalidData as any)).rejects.toThrow(
        'Budget data is invalid',
      );
    });
    it('throws an error when insertedItem is undefined', async () => {
      const mockData = createMockData('3000', 'monthly');
      (mockContainer.items.create as jest.Mock).mockResolvedValue({
        resource: undefined,
      });

      await expect(insertBudgetData(mockData)).rejects.toThrow(
        'Inserted item is undefined',
      );
    });
    it('throws an error when Cosmos SDK throws an error', async () => {
      const mockData = createMockData('3000', 'monthly');
      (mockContainer.items.create as jest.Mock).mockRejectedValue(
        new Error('Cosmos SDK error'),
      );

      await expect(insertBudgetData(mockData)).rejects.toThrow(
        'Failed to insert data into the database: Cosmos SDK error',
      );
    });
    it('throws a generic error when an unknown error occurs', async () => {
      const mockData = createMockData('3000', 'monthly');
      (mockContainer.items.create as jest.Mock).mockRejectedValue(new Error());

      await expect(insertBudgetData(mockData)).rejects.toThrow(
        'Failed to insert data into the database: Unknown error',
      );
    });
    it('uses the error message from the Cosmos SDK or falls back to a generic message', async () => {
      const mockData = createMockData('3000', 'monthly');

      (mockContainer.items.create as jest.Mock).mockRejectedValue(
        new Error('Cosmos error message'),
      );
      await expect(insertBudgetData(mockData)).rejects.toThrow(
        'Failed to insert data into the database: Cosmos error message',
      );

      (mockContainer.items.create as jest.Mock).mockRejectedValue(new Error());
      await expect(insertBudgetData(mockData)).rejects.toThrow(
        'Failed to insert data into the database: Unknown error',
      );
    });
  });
});
