import { Container } from '@azure/cosmos';
import { connectToDatabase } from './dbConnect';
import { BudgetData, validateBudgetData } from './dbInsert';
import { searchBudgetDataBySessionId } from './dbSearch';
import { updateBudgetData } from './dbUpdate';

// Mock the required modules
jest.mock('./dbConnect', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('./dbSearch', () => ({
  searchBudgetDataBySessionId: jest.fn(),
}));

jest.mock('./dbInsert', () => ({
  validateBudgetData: jest.fn(),
}));

describe('dbUpdate', () => {
  let mockContainer: jest.Mocked<Container>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockContainer = {
      item: jest.fn().mockReturnThis(),
      replace: jest.fn(),
    } as unknown as jest.Mocked<Container>;

    (connectToDatabase as jest.Mock).mockResolvedValue({
      container: mockContainer,
    });
  });

  describe('updateBudgetData', () => {
    it('successfully updates budget data', async () => {
      const mockExistingData: BudgetData = {
        sessionId: 'test-session-id',
        id: 'test-id',
        lastAccessed: new Date(),
        income: { pay: '3000', pay_frequency: 'monthly' },
        'household-bills': {},
        'living-costs': {},
        'finance-insurance': {},
        'family-friends': {},
        travel: {},
        leisure: {},
      };

      const mockUpdateData: Partial<BudgetData> = {
        income: { pay: '3500', pay_frequency: 'monthly' },
      };

      const mockUpdatedData: BudgetData = {
        ...mockExistingData,
        ...mockUpdateData,
      };

      (validateBudgetData as jest.Mock).mockReturnValue(true);
      (searchBudgetDataBySessionId as jest.Mock).mockResolvedValue(
        mockExistingData,
      );
      (
        mockContainer.item('test-session-id').replace as jest.Mock
      ).mockResolvedValue({
        resource: mockUpdatedData,
      });

      const result = await updateBudgetData('test-session-id', mockUpdateData);

      expect(result).toEqual(mockUpdatedData);
      expect(validateBudgetData).toHaveBeenCalledWith(
        expect.objectContaining(mockUpdateData),
      );
      expect(searchBudgetDataBySessionId).toHaveBeenCalledWith(
        'test-session-id',
      );
      expect(mockContainer.item).toHaveBeenCalledWith('test-session-id');
      expect(
        mockContainer.item('test-session-id').replace,
      ).toHaveBeenCalledWith(mockUpdatedData);
    });

    it('returns null when no budget data is found', async () => {
      (validateBudgetData as jest.Mock).mockReturnValue(true);
      (searchBudgetDataBySessionId as jest.Mock).mockResolvedValue(null);

      const result = await updateBudgetData('non-existent-session-id', {});

      expect(result).toBeNull();
      expect(searchBudgetDataBySessionId).toHaveBeenCalledWith(
        'non-existent-session-id',
      );
      expect(
        mockContainer.item('non-existent-session-id').replace,
      ).not.toHaveBeenCalled();
    });

    it('throws an error when budget data is invalid', async () => {
      (validateBudgetData as jest.Mock).mockReturnValue(false);

      await expect(updateBudgetData('test-session-id', {})).rejects.toThrow(
        'Budget data is invalid',
      );
      expect(validateBudgetData).toHaveBeenCalled();
      expect(searchBudgetDataBySessionId).not.toHaveBeenCalled();
    });

    it('throws an error when database update fails', async () => {
      (validateBudgetData as jest.Mock).mockReturnValue(true);
      (searchBudgetDataBySessionId as jest.Mock).mockResolvedValue({
        sessionId: 'test-session-id',
        id: 'test-id',
      } as BudgetData);
      (
        mockContainer.item('test-session-id').replace as jest.Mock
      ).mockRejectedValue(new Error('Database error'));

      await expect(updateBudgetData('test-session-id', {})).rejects.toThrow(
        'Failed to update data in the database: Database error',
      );
    });

    it('throws an error when updated item is undefined', async () => {
      (validateBudgetData as jest.Mock).mockReturnValue(true);
      (searchBudgetDataBySessionId as jest.Mock).mockResolvedValue(
        {} as BudgetData,
      );
      (
        mockContainer.item('test-session-id').replace as jest.Mock
      ).mockResolvedValue({
        resource: undefined,
      });

      await expect(updateBudgetData('test-session-id', {})).rejects.toThrow(
        'Updated item is undefined',
      );
    });
  });
});
