jest.mock('lib/database/dbConnect');

const { cosmosDbItemsQueryMock, resetCosmosDbItemsQueryMock } =
  jest.requireMock('lib/database/dbConnect');

import { fetchFirmByPrincipalEmail } from './fetchFirmByPrincipalEmail';

describe('fetchFirmByPrincipalEmail', () => {
  beforeEach(() => {
    resetCosmosDbItemsQueryMock();
  });

  it.each([
    ['whitespace-only email', '  '],
    ['non-string email', null as unknown as string],
  ])('returns error when %s', async (_label, email) => {
    const res = await fetchFirmByPrincipalEmail(email);
    expect(res.success).toBe(false);
    expect(res.error).toBe('Email is required');
  });

  it('queries cosmos and returns not found when no matches', async () => {
    cosmosDbItemsQueryMock.fetchAll.mockResolvedValue({ resources: [] });

    const res = await fetchFirmByPrincipalEmail('test@example.com');

    expect(res.success).toBe(false);
    expect(res.error).toBe('Firm not found');
    expect(cosmosDbItemsQueryMock.query).toHaveBeenCalledTimes(1);
  });

  it('treats missing resources array as empty', async () => {
    cosmosDbItemsQueryMock.fetchAll.mockResolvedValue({});

    const res = await fetchFirmByPrincipalEmail('test@example.com');

    expect(res.success).toBe(false);
    expect(res.error).toBe('Firm not found');
  });

  it('uses zero recency when dates are non-string and picks stable winner', async () => {
    cosmosDbItemsQueryMock.fetchAll.mockResolvedValue({
      resources: [
        {
          id: 'winner',
          updated_at: 12_345 as unknown as string,
          created_at: null as unknown as string,
        },
        {
          id: 'other',
          updated_at: 'also-invalid',
          created_at: 'also-invalid',
        },
      ],
    });

    const res = await fetchFirmByPrincipalEmail('pick@example.com');

    expect(res.success).toBe(true);
    expect(res.response?.id).toBe('winner');
  });

  it('scores firm with only unusable date strings as zero', async () => {
    cosmosDbItemsQueryMock.fetchAll.mockResolvedValue({
      resources: [
        {
          id: 'solo',
          updated_at: 'bad-a',
          created_at: 'bad-b',
        },
      ],
    });

    const res = await fetchFirmByPrincipalEmail('solo@example.com');

    expect(res.success).toBe(true);
    expect(res.response?.id).toBe('solo');
  });

  it('selects the most recent firm by updated_at then created_at', async () => {
    cosmosDbItemsQueryMock.fetchAll.mockResolvedValue({
      resources: [
        {
          id: 'old',
          updated_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'newer',
          updated_at: '2025-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
        },
      ],
    });

    const res = await fetchFirmByPrincipalEmail('TEST@EXAMPLE.COM');

    expect(res.success).toBe(true);
    expect(res.response?.id).toBe('newer');

    const querySpec = cosmosDbItemsQueryMock.query.mock.calls[0]?.[0] as {
      query: string;
      parameters: { name: string; value: string | number }[];
    };
    expect(querySpec.parameters).toEqual([
      { name: '@email', value: 'test@example.com' },
    ]);
  });

  it('falls back to created_at when updated_at is invalid', async () => {
    cosmosDbItemsQueryMock.fetchAll.mockResolvedValue({
      resources: [
        {
          id: 'a',
          updated_at: 'not-a-date',
          created_at: '2026-02-01T00:00:00Z',
        },
        {
          id: 'b',
          updated_at: 'not-a-date',
          created_at: '2026-06-01T00:00:00Z',
        },
      ],
    });

    const res = await fetchFirmByPrincipalEmail('x@y.com');

    expect(res.success).toBe(true);
    expect(res.response?.id).toBe('b');
  });

  it('returns fetch error when cosmos throws', async () => {
    cosmosDbItemsQueryMock.fetchAll.mockRejectedValue(new Error('cosmos down'));

    const res = await fetchFirmByPrincipalEmail('x@y.com');

    expect(res.success).toBe(false);
    expect(res.error).toBe('Failed to fetch firm data');
  });
});
