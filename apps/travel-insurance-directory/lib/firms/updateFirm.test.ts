import { updateFirm } from './updateFirm';

const mockPatch = jest.fn();

const mockContainer = {
  item: jest.fn().mockReturnValue({
    patch: mockPatch,
  }),
};

jest.mock('lib/database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: mockContainer,
    }),
}));

describe('updateFirm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully patch a firm with provided updates', async () => {
    const id = 'firm_123';
    const updates = { registered_name: 'Updated Firm Name' };

    mockPatch.mockResolvedValue({ resource: { id, ...updates } });

    const result = await updateFirm(id, updates);

    expect(mockPatch).toHaveBeenCalledWith([
      {
        op: 'set',
        path: '/registered_name',
        value: 'Updated Firm Name',
      },
      {
        op: 'set',
        path: '/updated_at',
        value: expect.any(String),
      },
    ]);

    expect(result.success).toBe(true);
    expect(result.response.id).toBe(id);
  });

  it('should handle database errors gracefully', async () => {
    mockPatch.mockRejectedValue(new Error('Cosmos DB Error'));

    const result = await updateFirm('id', {});

    expect(result).toEqual({ error: 'Failed to update progress' });
  });
});
