import { createFirm } from './createFirm';

const mockCreate = jest.fn();
const mockQuery = jest.fn();

const mockContainer = {
  items: { query: mockQuery, create: mockCreate },
};

jest.mock('lib/database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: mockContainer,
    }),
}));

describe('createFirm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if frnNumber is missing', async () => {
    const result = await createFirm({});
    expect(result.success).toBe(false);
    expect(result.error).toContain('frnNumber is required');
  });

  it('should return error if firm already exists', async () => {
    mockQuery.mockImplementation(() => ({
      fetchAll: () =>
        Promise.resolve({
          resources: [{ id: 'existing-id-123', fca_number: '123456' }],
        }),
    }));

    const result = await createFirm({ frnNumber: '123456' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Firm already registered');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('should create a new firm if it does not exist', async () => {
    mockQuery.mockImplementation(() => ({
      fetchAll: () =>
        Promise.resolve({
          resources: [],
        }),
    }));

    const mockResponse = { id: 'new-uuid', fca_number: 111111 };

    mockCreate.mockResolvedValue({
      resource: { id: 'new-uuid', fca_number: 111111 },
    });

    const result = await createFirm({ frnNumber: '111111' });

    expect(result.success).toBe(true);
    expect(result.response).toEqual(mockResponse);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        fca_number: 111111,
        status: 'hidden',
        created_at: expect.any(String),
      }),
    );
  });

  it('should handle database errors gracefully', async () => {
    mockQuery.mockImplementation(() => ({
      fetchAll: () => Promise.reject(new Error('Connection Failed')),
    }));

    const result = await createFirm({ frnNumber: '111111' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to create organisation');
  });
});
