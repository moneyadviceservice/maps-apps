import { validateReferrer } from './validateReferrer';

type ValidateReferrer = {
  success: boolean;
  message: string;
  correlationId: string;
};

globalThis.fetch = jest.fn();

describe('validateReferrer', () => {
  const originalEnv = process.env;

  const mockFetch = fetch as jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv };
    process.env.FETCH_VALIDATE_REFERRER_CODE = 'test-code';
    process.env.APPOINTMENTS_API = 'https://api.example.com/';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns validated referrer when API responds correctly', async () => {
    const mockResponse: ValidateReferrer = {
      success: true,
      message: 'Referrer validated',
      correlationId: 'abc-123',
    };

    (mockFetch as jest.MockedFunction<typeof mockFetch>).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await validateReferrer('ref-123');

    expect(result).toEqual({ validatedReferrerId: mockResponse });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/ValidateReferrer?code=test-code',
      {
        body: '{"referrerID":"ref-123"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      },
    );
  });

  it('returns error if API response is not ok', async () => {
    (mockFetch as jest.MockedFunction<typeof mockFetch>).mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
    });

    const result = await validateReferrer('ref-123');

    expect(result).toEqual({
      error: 'Failed to validate referrer Id',
    });
  });

  it('returns error if API returns invalid response', async () => {
    const invalidResponse = { invalid: 'data' };

    (mockFetch as jest.MockedFunction<typeof mockFetch>).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(invalidResponse),
    });

    const result = await validateReferrer('ref-123');

    expect(result).toEqual({
      error: 'Failed to validate referrer Id',
    });
  });

  it('returns error if fetch throws an exception', async () => {
    (mockFetch as jest.MockedFunction<typeof mockFetch>).mockRejectedValueOnce(
      new Error('Network error'),
    );

    const result = await validateReferrer('ref-123');

    expect(result).toEqual({
      error: 'Failed to validate referrer Id',
    });
  });

  it('returns error if FETCH_VALIDATE_REFERRER_CODE is missing', async () => {
    delete process.env.FETCH_VALIDATE_REFERRER_CODE;

    const result = await validateReferrer('ref-123');

    expect(result).toEqual({
      error: 'Failed to validate referrer Id',
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
