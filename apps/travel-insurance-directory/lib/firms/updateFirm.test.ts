import { updateFirm } from './updateFirm';

const mockRead = jest.fn();
const mockReplace = jest.fn();

const mockItem = {
  read: mockRead,
  replace: mockReplace,
};

const mockContainer = {
  item: jest.fn().mockReturnValue(mockItem),
};

jest.mock('lib/database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: mockContainer,
    }),
}));

const id = 'firm_123';

describe('updateFirm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update a top-level field', async () => {
    mockRead.mockResolvedValue({
      resource: {
        id,
        registered_name: 'Old Firm Name',
      },
    });

    mockReplace.mockResolvedValue({
      resource: {
        id,
        registered_name: 'Updated Firm Name',
      },
    });

    const result = await updateFirm(id, {
      registered_name: 'Updated Firm Name',
    });

    expect(mockReplace).toHaveBeenCalledWith({
      id,
      registered_name: 'Updated Firm Name',
      updated_at: expect.any(String),
    });

    expect(result.success).toBe(true);
    expect(result.response.id).toBe(id);
  });

  it('should create nested objects when parent paths are null', async () => {
    mockRead.mockResolvedValue({
      resource: {
        id,
        office: null,
      },
    });

    mockReplace.mockResolvedValue({
      resource: {
        id,
        office: {
          contact: {
            email_address: 'test@example.com',
          },
        },
      },
    });

    await updateFirm(id, {
      'office/contact/email_address': 'test@example.com',
    });

    expect(mockReplace).toHaveBeenCalledWith({
      id,
      office: {
        contact: {
          email_address: 'test@example.com',
        },
      },
      updated_at: expect.any(String),
    });
  });

  it('should support dot notation paths', async () => {
    mockRead.mockResolvedValue({
      resource: {
        id,
      },
    });

    mockReplace.mockResolvedValue({
      resource: {},
    });

    await updateFirm(id, {
      'office.contact.email_address': 'test@example.com',
    });

    expect(mockReplace).toHaveBeenCalledWith({
      id,
      office: {
        contact: {
          email_address: 'test@example.com',
        },
      },
      updated_at: expect.any(String),
    });
  });

  it('should return an error when the document does not exist', async () => {
    mockRead.mockResolvedValue({
      resource: null,
    });

    const result = await updateFirm('missing-id', {});

    expect(mockReplace).not.toHaveBeenCalled();

    expect(result).toEqual({
      error: 'Document not found',
    });
  });

  it('should handle database errors gracefully', async () => {
    mockRead.mockRejectedValue(new Error('Cosmos DB Error'));

    const result = await updateFirm('id', {});

    expect(result).toEqual({
      error: 'Failed to update progress',
    });
  });

  it.each([
    {
      name: 'set hidden_at when status is updated to hidden',
      currentItem: {
        id: 'firm_123',
        status: 'active',
        hidden_at: null,
      },
      updates: {
        status: 'hidden',
      },
      expected: {
        id: 'firm_123',
        status: 'hidden',
        hidden_at: expect.any(String),
        updated_at: expect.any(String),
      },
    },
    {
      name: 'remove hidden_at when status is updated from hidden to active',
      currentItem: {
        id: 'firm_123',
        status: 'hidden',
        hidden_at: '2025-01-01T00:00:00.000Z',
      },
      updates: {
        status: 'active',
      },
      expected: {
        id: 'firm_123',
        status: 'active',
        hidden_at: null,
        updated_at: expect.any(String),
      },
    },
    {
      name: 'not update hidden_at when status is not changed',
      currentItem: {
        id: 'firm_123',
        status: 'hidden',
        hidden_at: '2025-01-01T00:00:00.000Z',
        registered_name: 'Old Name',
      },
      updates: {
        registered_name: 'New Name',
      },
      expected: {
        id: 'firm_123',
        status: 'hidden',
        hidden_at: '2025-01-01T00:00:00.000Z',
        registered_name: 'New Name',
        updated_at: expect.any(String),
      },
    },
  ])('$name', async ({ currentItem, updates, expected }) => {
    mockRead.mockResolvedValue({
      resource: currentItem,
    });

    mockReplace.mockResolvedValue({
      resource: {},
    });

    await updateFirm(id, updates);

    expect(mockReplace).toHaveBeenCalledWith(expected);
  });
});
