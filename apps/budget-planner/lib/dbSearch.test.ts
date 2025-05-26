import { Container } from '@azure/cosmos';
import { connectToDatabase } from './dbConnect';
import { BudgetData } from './dbInsert';
import { searchBudgetDataBySessionId } from './dbSearch';

// Mock the connectToDatabase function
jest.mock('./dbConnect', () => ({
  connectToDatabase: jest.fn(),
}));

describe('dbSearch', () => {
  let mockContainer: jest.Mocked<Container>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockContainer = {
      items: {
        query: jest.fn(),
      },
    } as unknown as jest.Mocked<Container>;

    (connectToDatabase as jest.Mock).mockResolvedValue({
      container: mockContainer,
    });
  });

  describe('searchBudgetDataBySessionId', () => {
    it('successfully finds budget data by sessionId', async () => {
      const mockData: BudgetData = {
        sessionId: 'test-session-id',
        lastAccessed: new Date(),
        income: { pay: '3000', pay_frequency: 'monthly' },
        'household-bills': {},
        'living-costs': {},
        'finance-insurance': {},
        'family-friends': {},
        travel: {},
        leisure: {},
      };

      (mockContainer.items.query as jest.Mock).mockImplementation(() => ({
        fetchAll: jest.fn().mockResolvedValue({ resources: [mockData] }),
      }));

      const result = await searchBudgetDataBySessionId('test-session-id');

      expect(result).toEqual(mockData);
      expect(mockContainer.items.query).toHaveBeenCalledWith({
        query: 'SELECT * FROM c WHERE c.sessionId = @sessionId',
        parameters: [{ name: '@sessionId', value: 'test-session-id' }],
      });
    });

    it('returns null when no budget data is found', async () => {
      (mockContainer.items.query as jest.Mock).mockImplementation(() => ({
        fetchAll: jest.fn().mockResolvedValue({ resources: [] }),
      }));

      const result = await searchBudgetDataBySessionId(
        'non-existent-session-id',
      );

      expect(result).toBeNull();
      expect(mockContainer.items.query).toHaveBeenCalledWith({
        query: 'SELECT * FROM c WHERE c.sessionId = @sessionId',
        parameters: [{ name: '@sessionId', value: 'non-existent-session-id' }],
      });
    });

    it('throws an error when database query fails', async () => {
      (mockContainer.items.query as jest.Mock).mockImplementation(() => ({
        fetchAll: jest.fn().mockRejectedValue(new Error('Database error')),
      }));

      await expect(
        searchBudgetDataBySessionId('test-session-id'),
      ).rejects.toThrow(
        'Failed to search data in the database: Database error',
      );
    });
  });
});
