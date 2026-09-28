import { getBusinessClosureStatus } from './getBusinessClosureStatus';

globalThis.fetch = jest.fn();

const closureErrorMessage = {
  closureError: 'Failed to fetch business closed status',
};

const mockObjects = {
  success: {
    success: true,
    date: '2025-11-08',
    closed: false,
  },
  missingClosed: { success: true, date: '2025-11-08' },
  missingDate: { success: true, date: '2025-11-08' },
  closed: { success: true, date: '2025-11-08', closed: true },
};

describe('getBusinessClosureStatus', () => {
  const mockFetch = fetch as jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.FETCH_BUSINESS_CLOSED_CODE = 'testcode';
    process.env.APPOINTMENTS_API = 'https://api.example.com/';
  });

  it.each`
    description                                              | mockResponse                 | equals
    ${'returns businessClosureStatus on valid API response'} | ${mockObjects.success}       | ${{ businessClosureStatus: mockObjects.success }}
    ${'returns null for missing fields'}                     | ${mockObjects.missingClosed} | ${closureErrorMessage}
    ${'returns closed object when fetching a closed date'}   | ${mockObjects.closed}        | ${{ businessClosureStatus: { ...mockObjects.success, closed: true } }}
    ${'returns closureError for invalid JSON shape'}         | ${mockObjects.missingDate}   | ${closureErrorMessage}
  `(`$description`, async ({ mockResponse, equals }) => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getBusinessClosureStatus();
    expect(result).toEqual(equals);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('GetBusinessClosureStatus'),
    );
  });

  it('returns closureError if fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network error'));

    const result = await getBusinessClosureStatus();

    expect(result).toEqual(closureErrorMessage);
  });

  it('returns closureError if API responds with non-ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
    });

    const result = await getBusinessClosureStatus();

    expect(result).toEqual(closureErrorMessage);
  });

  it('returns closureError if FETCH_BUSINESS_CLOSED_CODE is missing', async () => {
    delete process.env.FETCH_BUSINESS_CLOSED_CODE;

    const result = await getBusinessClosureStatus();

    expect(result).toEqual(closureErrorMessage);
  });
});
