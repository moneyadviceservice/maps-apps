import { adminCiE2eConstants } from 'lib/admin/dashboard/ciFixture/ciFixture';
import { IronSessionObject } from 'types/iron-session';

import { getFirmById, getSessionFirm } from './fetchFirm';

const mockRead = jest.fn();
const mockFetchAll = jest.fn();
const mockQuery = jest.fn().mockReturnValue({ fetchAll: mockFetchAll });

const mockContainer = {
  item: jest.fn().mockReturnValue({
    read: mockRead,
  }),
  items: { query: mockQuery },
};

jest.mock('lib/database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: mockContainer,
    }),
}));

describe('getSessionFirm', () => {
  it('returns session.firmData as a main firm', () => {
    const result = getSessionFirm({
      firmData: { id: '123', registered_name: 'Session Firm' },
      db_id: '123',
    } as IronSessionObject);

    expect(result).toEqual({
      success: true,
      response: {
        id: '123',
        registered_name: 'Session Firm',
        type: 'main',
      },
    });
  });

  it('can override id on the response', () => {
    const result = getSessionFirm(
      {
        firmData: { registered_name: 'Session Firm' },
        db_id: 'playwright-id',
      } as IronSessionObject,
      'playwright-id',
    );

    expect(result.response?.id).toBe('playwright-id');
  });
});

describe('getFirmById', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns firm data from Cosmos', async () => {
    delete process.env.CI;
    const mockFirm = { id: 'firm_123', registered_name: 'Test Firm' };
    mockRead.mockResolvedValue({ resource: mockFirm });
    mockFetchAll.mockResolvedValue({ resources: [] });

    const result = await getFirmById('firm_123');

    expect(result.success).toBe(true);
    expect(result.response).toEqual(mockFirm);
  });

  it('returns admin CI fixture without Cosmos', async () => {
    process.env.CI = 'true';

    const result = await getFirmById(adminCiE2eConstants.mainAlpha.id);

    expect(result.success).toBe(true);
    expect(result.response?.id).toBe(adminCiE2eConstants.mainAlpha.id);
    expect(mockContainer.item).not.toHaveBeenCalled();
  });

  it('reads from Cosmos in CI for non-fixture ids', async () => {
    process.env.CI = 'true';
    const mockFirm = {
      id: 'firm-from-cosmos',
      registered_name: 'Cosmos Firm',
    };
    mockRead.mockResolvedValue({ resource: mockFirm });

    const result = await getFirmById('firm-from-cosmos');

    expect(mockContainer.item).toHaveBeenCalledWith(
      'firm-from-cosmos',
      'firm-from-cosmos',
    );
    expect(result.response).toEqual(mockFirm);
  });

  it('returns error when firm does not exist', async () => {
    delete process.env.CI;
    mockRead.mockResolvedValue({ resource: null });
    mockFetchAll.mockResolvedValue({ resources: [] });

    const result = await getFirmById('non_existent');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Firm not found');
  });
});
