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

  it('maps omitted principal contact fields to null in Cosmos payload', async () => {
    mockQuery.mockImplementation(() => ({
      fetchAll: () => Promise.resolve({ resources: [] }),
    }));

    mockCreate.mockResolvedValue({
      resource: { id: 'u', fca_number: 555555 },
    });

    await createFirm({
      frnNumber: '555555',
      principal: {
        first_name: 'Pat',
        last_name: 'Lee',
        individual_reference_number: 'IRN555',
      },
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'main',
        principal: expect.objectContaining({
          job_title: null,
          email_address: null,
          telephone_number: null,
        }),
      }),
    );
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

    const result = await createFirm({
      frnNumber: '111111',
      principal: {
        first_name: 'Ada',
        last_name: 'Lovelace',
        job_title: 'Engineer',
        email_address: 'ada@example.com',
        telephone_number: '01234',
        individual_reference_number: 'IRN123',
      },
    });

    expect(result.success).toBe(true);
    expect(result.response).toEqual(mockResponse);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'main',
        fca_number: 111111,
        status: 'hidden',
        created_at: expect.any(String),
        principal: expect.objectContaining({
          first_name: 'Ada',
          last_name: 'Lovelace',
          email_address: 'ada@example.com',
          individual_reference_number: 'IRN123',
          created_at: expect.any(String),
        }),
      }),
    );
  });

  it('should set registered_name from firmName when provided', async () => {
    mockQuery.mockImplementation(() => ({
      fetchAll: () =>
        Promise.resolve({
          resources: [],
        }),
    }));

    mockCreate.mockResolvedValue({
      resource: { id: 'new-uuid', fca_number: 111111, registered_name: 'Acme' },
    });

    const result = await createFirm({ frnNumber: '111111', firmName: 'Acme' });

    expect(result.success).toBe(true);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        fca_number: 111111,
        registered_name: 'Acme',
      }),
    );
  });

  it('should create firm with empty principal when principal omitted', async () => {
    mockQuery.mockImplementation(() => ({
      fetchAll: () => Promise.resolve({ resources: [] }),
    }));

    mockCreate.mockResolvedValue({
      resource: { id: 'new-id', fca_number: 222222 },
    });

    const result = await createFirm({
      frnNumber: '222222',
      firmName: ' Solo ',
    });

    expect(result.success).toBe(true);
    const payload = mockCreate.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.principal).toEqual(
      expect.objectContaining({
        first_name: null,
        last_name: null,
      }),
    );
    expect(payload).toMatchObject({
      registered_name: 'Solo',
      fca_number: 222222,
    });
  });

  it('should treat non-string firmName as empty registered_name', async () => {
    mockQuery.mockImplementation(() => ({
      fetchAll: () => Promise.resolve({ resources: [] }),
    }));

    mockCreate.mockResolvedValue({
      resource: { id: 'new-id', fca_number: 333333 },
    });

    await createFirm({
      frnNumber: '333333',
      firmName: null as unknown as string,
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ registered_name: '' }),
    );
  });

  it('should handle create() throwing after uniqueness check', async () => {
    mockQuery.mockImplementation(() => ({
      fetchAll: () => Promise.resolve({ resources: [] }),
    }));

    mockCreate.mockRejectedValue(new Error('write failed'));

    const result = await createFirm({ frnNumber: '444444' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to create organisation');
  });
});
