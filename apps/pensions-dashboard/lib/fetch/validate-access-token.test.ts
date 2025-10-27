import { REQUEST_FAILED, RESPONSE_NOT_OK } from '../constants';
import { validateAccessToken } from './validate-access-token';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.Mock;

describe('validateAccessToken', () => {
  const mockToken = 'test-access-token';
  const mockServiceUrl = 'test-service.com';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => null);
    process.env.MHPD_BETA_ACCESS_SERVICE = mockServiceUrl;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call the correct endpoint URL', async () => {
    const mockResponse = { ok: true };
    mockFetch.mockResolvedValue(mockResponse);

    await validateAccessToken(mockToken);

    expect(mockFetch).toHaveBeenCalledWith(
      `${mockServiceUrl}/validate`,
      expect.any(Object),
    );
  });

  it('should successfully validate token when response is ok', async () => {
    const mockResponse = {
      ok: true,
    };

    mockFetch.mockResolvedValue(mockResponse);

    await expect(validateAccessToken(mockToken)).resolves.not.toThrow();

    expect(mockFetch).toHaveBeenCalledWith(`${mockServiceUrl}/validate`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', token: mockToken },
    });
  });

  describe('error handling', () => {
    it('should throw error when environment variable is not defined', async () => {
      delete process.env.MHPD_BETA_ACCESS_SERVICE;

      await expect(validateAccessToken(mockToken)).rejects.toThrow(
        'MHPD_BETA_ACCESS_SERVICE environment variable is not defined',
      );

      expect(console.error).toHaveBeenCalledWith(
        REQUEST_FAILED,
        expect.any(Error),
      );
    });

    it.each`
      scenario                | status
      ${'unauthorized (401)'} | ${401}
      ${'forbidden (403)'}    | ${403}
      ${'not found (404)'}    | ${404}
      ${'server error (500)'} | ${500}
    `(
      'should throw error when response status is $scenario',
      async ({ status }) => {
        const mockResponse = {
          ok: false,
          status,
        };

        mockFetch.mockResolvedValue(mockResponse);

        await expect(validateAccessToken(mockToken)).rejects.toThrow(
          RESPONSE_NOT_OK,
        );

        expect(console.error).toHaveBeenCalledWith(
          REQUEST_FAILED,
          expect.any(Error),
        );
      },
    );

    it('should throw error when fetch throws network error', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(validateAccessToken(mockToken)).rejects.toThrow(
        networkError,
      );

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, networkError);
    });

    it('should throw error when fetch throws timeout error', async () => {
      const timeoutError = new Error('Request timeout');
      mockFetch.mockRejectedValue(timeoutError);

      await expect(validateAccessToken(mockToken)).rejects.toThrow(
        timeoutError,
      );

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, timeoutError);
    });
  });
});
