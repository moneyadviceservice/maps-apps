import { dbConnect } from 'lib/database/dbConnect';

import { getOrganisationStatus } from './getOrganisationStatus'; // Update path as needed

jest.mock('lib/database/dbConnect');

const mockDbConnect = jest.mocked(dbConnect);

describe('getOrganisationStatus', () => {
  let mockContainer: any;
  let mockQuery: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery = {
      fetchAll: jest.fn(),
    };
    mockContainer = {
      items: {
        query: jest.fn().mockReturnValue(mockQuery),
      },
    };

    mockDbConnect.mockResolvedValue({ container: mockContainer } as any);
  });

  describe('successful scenarios', () => {
    it('should return true when organisation has active licence', async () => {
      const mockResources = [
        {
          id: '1',
          email: 'test@example.com',
          licence_status: 'active',
        },
      ];

      mockQuery.fetchAll.mockResolvedValue({ resources: mockResources });

      const result = await getOrganisationStatus('test@example.com');

      expect(result).toBe(true);
      expect(mockContainer.items.query).toHaveBeenCalledWith({
        query: 'SELECT * FROM c WHERE c.email = @email',
        parameters: [{ name: '@email', value: 'test@example.com' }],
      });
    });

    it('should return false when organisation has inactive licence', async () => {
      const mockResources = [
        {
          id: '1',
          email: 'test@example.com',
          licence_status: 'inactive',
        },
      ];

      mockQuery.fetchAll.mockResolvedValue({ resources: mockResources });

      const result = await getOrganisationStatus('test@example.com');

      expect(result).toBe(false);
    });

    it('should return false when licence_status is null', async () => {
      const mockResources = [
        {
          id: '1',
          email: 'test@example.com',
          licence_status: null,
        },
      ];

      mockQuery.fetchAll.mockResolvedValue({ resources: mockResources });

      const result = await getOrganisationStatus('test@example.com');

      expect(result).toBe(false);
    });

    it('should return false when licence_status is undefined', async () => {
      const mockResources = [
        {
          id: '1',
          email: 'test@example.com',
          // licence_status is undefined
        },
      ];

      mockQuery.fetchAll.mockResolvedValue({ resources: mockResources });

      const result = await getOrganisationStatus('test@example.com');

      expect(result).toBe(false);
    });

    it('should handle different licence status values correctly', async () => {
      const testCases = [
        { status: 'active', expected: true },
        { status: 'expired', expected: false },
        { status: 'suspended', expected: false },
        { status: 'pending', expected: false },
        { status: '', expected: false },
      ];

      for (const testCase of testCases) {
        mockQuery.fetchAll.mockResolvedValue({
          resources: [
            { email: 'test@example.com', licence_status: testCase.status },
          ],
        });

        const result = await getOrganisationStatus('test@example.com');
        expect(result).toBe(testCase.expected);
      }
    });
  });
});
