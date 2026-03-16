import { fetchFirm } from './fetchFirm';

const mockRead = jest.fn();
const mockCreate = jest.fn();
const mockQuery = jest.fn();

const mockContainer = {
  item: jest.fn().mockReturnValue({
    read: mockRead,
  }),
  items: { query: mockQuery, create: mockCreate },
};

jest.mock('lib/database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: mockContainer,
    }),
}));

describe('fetchFirm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return firm data when a valid ID is provided', async () => {
    const mockFirm = { id: 'firm_123', registered_name: 'Test Firm' };
    mockRead.mockResolvedValue({ resource: mockFirm });
    const result = await fetchFirm('firm_123');

    expect(result.success).toBe(true);
    expect(result.response).toEqual(mockFirm);
  });

  it('should return error when firm does not exist', async () => {
    mockRead.mockResolvedValue({ resource: null });

    const result = await fetchFirm('non_existent');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Firm not found');
  });

  it('should handle database connection errors', async () => {
    mockRead.mockRejectedValue(new Error('Connection failed'));

    const result = await fetchFirm('firm_123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to fetch firm data');
  });
});
