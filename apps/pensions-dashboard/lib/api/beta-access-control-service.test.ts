import { REQUEST_FAILED, RESPONSE_NOT_OK } from '../constants';
import {
  getAccessToken,
  validateAccessToken,
} from './beta-access-control-service';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.Mock;

describe('Beta Access Control Service', () => {
  describe('getAccessToken', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
      jest.spyOn(console, 'error').mockImplementation(() => null);

      // Set up default environment variables
      process.env = {
        ...originalEnv,
        MHPD_SECURE_BETA_ENABLED: 'true',
        MHPD_BETA_ACCESS_SERVICE: 'test-service.com',
      };
    });

    afterEach(() => {
      jest.restoreAllMocks();
      process.env = originalEnv;
    });

    it('should return token when successful', async () => {
      const linkId = 'test-link-id';
      const expectedToken = 'test-access-token';

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ token: expectedToken }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getAccessToken(linkId);

      expect(mockFetch).toHaveBeenCalledWith(
        'test-service.com/activate?linkId=test-link-id',
      );
      expect(result).toBe(expectedToken);
    });

    it('should encode linkId in URL', async () => {
      const linkId = 'test link with spaces & special chars';
      const expectedToken = 'test-token';

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ token: expectedToken }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await getAccessToken(linkId);

      expect(mockFetch).toHaveBeenCalledWith(
        'test-service.com/activate?linkId=test%20link%20with%20spaces%20%26%20special%20chars',
      );
    });

    it('should throw error when secure beta access is not enabled', async () => {
      process.env.MHPD_SECURE_BETA_ENABLED = 'false';

      await expect(getAccessToken('test-link-id')).rejects.toThrow(
        'Secure beta access is not enabled.',
      );

      expect(console.error).toHaveBeenCalledWith(
        REQUEST_FAILED,
        expect.any(Error),
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should throw error when MHPD_BETA_ACCESS_SERVICE is not provided', async () => {
      delete process.env.MHPD_BETA_ACCESS_SERVICE;

      await expect(getAccessToken('test-link-id')).rejects.toThrow(
        'Missing required configuration or linkId',
      );

      expect(console.error).toHaveBeenCalledWith(
        REQUEST_FAILED,
        expect.any(Error),
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it.each`
      scenario                    | linkId
      ${'linkId is undefined'}    | ${undefined}
      ${'linkId is empty string'} | ${''}
    `('should throw error when $scenario', async ({ linkId }) => {
      await expect(getAccessToken(linkId)).rejects.toThrow(
        'Missing required configuration or linkId',
      );

      expect(console.error).toHaveBeenCalledWith(
        REQUEST_FAILED,
        expect.any(Error),
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it.each`
      scenario                      | status
      ${'response is not ok (400)'} | ${400}
      ${'response is not ok (404)'} | ${404}
      ${'response is not ok (500)'} | ${500}
    `('should throw error when $scenario', async ({ status }) => {
      const mockResponse = {
        ok: false,
        status,
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(getAccessToken('test-link-id')).rejects.toThrow(
        RESPONSE_NOT_OK,
      );

      expect(console.error).toHaveBeenCalledWith(
        REQUEST_FAILED,
        expect.any(Error),
      );
    });

    it('should throw error when fetch fails', async () => {
      const fetchError = new Error('Network error');
      mockFetch.mockRejectedValue(fetchError);

      await expect(getAccessToken('test-link-id')).rejects.toThrow(
        'Network error',
      );

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, fetchError);
    });

    it('should throw error when JSON parsing fails', async () => {
      const jsonError = new Error('Invalid JSON');
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(jsonError),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(getAccessToken('test-link-id')).rejects.toThrow(
        'Invalid JSON',
      );

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, jsonError);
    });

    it('should handle response with missing token property', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await getAccessToken('test-link-id');

      expect(result).toBeUndefined();
    });
  });

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

        expect(console.error).toHaveBeenCalledWith(
          REQUEST_FAILED,
          networkError,
        );
      });

      it('should throw error when fetch throws timeout error', async () => {
        const timeoutError = new Error('Request timeout');
        mockFetch.mockRejectedValue(timeoutError);

        await expect(validateAccessToken(mockToken)).rejects.toThrow(
          timeoutError,
        );

        expect(console.error).toHaveBeenCalledWith(
          REQUEST_FAILED,
          timeoutError,
        );
      });
    });
  });
});
