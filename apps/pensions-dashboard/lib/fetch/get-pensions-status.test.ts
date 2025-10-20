import {
  DATA_NOT_FOUND,
  REQUEST_FAILED,
  RESPONSE_NOT_OK,
  SESSION_EXPIRED,
} from '../constants';
import {
  baseUserSession,
  fullUserSession,
  mockPensionsStatus,
} from '../mocks/api';
import { isSessionExpired, setupCommonMocks } from '../utils';
import { getPensionsStatus } from './get-pensions-status';
jest.mock('../utils/isSessionExpired', () => ({
  isSessionExpired: jest.fn(),
}));

const mockIsSessionExpired = isSessionExpired as jest.MockedFunction<
  typeof isSessionExpired
>;

describe('getPensionsStatus', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    setupCommonMocks();
    mockIsSessionExpired.mockResolvedValue(false);
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('session expiry checks', () => {
    test('should throw SESSION_EXPIRED error when session is expired', async () => {
      mockIsSessionExpired.mockResolvedValue(true);

      await expect(
        getPensionsStatus({ userSession: baseUserSession }),
      ).rejects.toThrow(SESSION_EXPIRED);

      expect(mockIsSessionExpired).toHaveBeenCalledWith(undefined);
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should call isSessionExpired with sessionStart when provided', async () => {
      mockIsSessionExpired.mockResolvedValue(false);
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPensionsStatus),
      });

      await getPensionsStatus({ userSession: fullUserSession });

      expect(mockIsSessionExpired).toHaveBeenCalledWith('1000000000');
    });
  });

  describe('successful pensions status retrieval', () => {
    test('should return pensions status with basic user session', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPensionsStatus),
      });

      const result = await getPensionsStatus({
        userSession: baseUserSession,
      });

      expect(result).toStrictEqual(mockPensionsStatus);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.MHPD_PENSION_DATA_SERVICE}/pensions-status`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            userSessionId: 'test-session-id',
            mhpdCorrelationId: 'test-session-id',
          }),
          signal: expect.any(AbortSignal),
        }),
      );
    });

    test('should return pensions status with full user session', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPensionsStatus),
      });

      const result = await getPensionsStatus({
        userSession: fullUserSession,
      });

      expect(result).toEqual(mockPensionsStatus);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.MHPD_PENSION_DATA_SERVICE}/pensions-status`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            userSessionId: 'test-session-id',
            mhpdCorrelationId: 'test-session-id',
          }),
          signal: expect.any(AbortSignal),
        }),
      );
    });
  });

  describe('error handling', () => {
    test('should throw error when response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(
        getPensionsStatus({ userSession: baseUserSession }),
      ).rejects.toThrow(RESPONSE_NOT_OK);

      expect(console.error).toHaveBeenCalledWith(
        REQUEST_FAILED,
        expect.any(Error),
      );
    });

    test('should throw error when data is null', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(
        getPensionsStatus({ userSession: baseUserSession }),
      ).rejects.toThrow(DATA_NOT_FOUND);

      expect(console.error).toHaveBeenCalledWith(
        REQUEST_FAILED,
        expect.any(Error),
      );
    });

    test('should throw error when data is undefined', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(undefined),
      });

      await expect(
        getPensionsStatus({ userSession: baseUserSession }),
      ).rejects.toThrow(DATA_NOT_FOUND);
    });

    test('should throw and log error when fetch fails', async () => {
      const fetchError = new Error('Network error');
      (fetch as jest.Mock).mockRejectedValueOnce(fetchError);

      await expect(
        getPensionsStatus({ userSession: baseUserSession }),
      ).rejects.toThrow('Network error');

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, fetchError);
    });

    test('should throw and log error when JSON parsing fails', async () => {
      const jsonError = new Error('Invalid JSON');
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockRejectedValueOnce(jsonError),
      });

      await expect(
        getPensionsStatus({ userSession: baseUserSession }),
      ).rejects.toThrow('Invalid JSON');

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, jsonError);
    });
  });
});
