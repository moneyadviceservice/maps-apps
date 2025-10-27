import {
  DATA_NOT_FOUND,
  REQUEST_FAILED,
  RESPONSE_NOT_OK,
  SESSION_EXPIRED,
} from '../constants';
import {
  baseUserSession,
  fullUserSession,
  mockPensionDetailById,
} from '../mocks/api';
import { PensionArrangement } from '../types';
import { isSessionExpired, setupCommonMocks } from '../utils';
import { getPensionDetailById } from './get-pension-detail-by-id';

jest.mock('../utils/isSessionExpired', () => ({
  isSessionExpired: jest.fn(),
}));

const mockIsSessionExpired = isSessionExpired as jest.MockedFunction<
  typeof isSessionExpired
>;

describe('getPensionDetailById', () => {
  beforeEach(() => {
    setupCommonMocks();
    mockIsSessionExpired.mockResolvedValue(false);
  });

  describe('session expiry checks', () => {
    test('should throw SESSION_EXPIRED error when session is expired', async () => {
      mockIsSessionExpired.mockResolvedValue(true);

      await expect(
        getPensionDetailById('asset1', {
          userSession: baseUserSession,
        }),
      ).rejects.toThrow(SESSION_EXPIRED);

      expect(mockIsSessionExpired).toHaveBeenCalledWith(undefined);
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should call isSessionExpired with sessionStart when provided', async () => {
      mockIsSessionExpired.mockResolvedValue(false);
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPensionDetailById),
      });

      await getPensionDetailById('asset1', {
        userSession: fullUserSession,
      });

      expect(mockIsSessionExpired).toHaveBeenCalledWith('1000000000');
    });
  });

  describe('successful data retrieval', () => {
    test('should return pension by id with basic user session', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce([mockPensionDetailById]),
      });

      const result = await getPensionDetailById('asset1', {
        userSession: baseUserSession,
      });

      expect(result).toEqual(mockPensionDetailById);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.MHPD_PENSION_DATA_SERVICE}/pension-detail/asset1`,
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

    test('should return pension by id with full user session', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce([mockPensionDetailById]),
      });

      const result = await getPensionDetailById('asset1', {
        userSession: fullUserSession,
      });

      expect(result).toEqual(mockPensionDetailById);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.MHPD_PENSION_DATA_SERVICE}/pension-detail/asset1`,
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
        getPensionDetailById('asset1', {
          userSession: baseUserSession,
        }),
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
        getPensionDetailById('asset1', {
          userSession: baseUserSession,
        }),
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
        getPensionDetailById('asset1', {
          userSession: baseUserSession,
        }),
      ).rejects.toThrow(DATA_NOT_FOUND);
    });

    test('should throw and log error when fetch fails', async () => {
      const fetchError = new Error('Network error');
      (fetch as jest.Mock).mockRejectedValueOnce(fetchError);

      await expect(
        getPensionDetailById('asset1', {
          userSession: baseUserSession,
        }),
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
        getPensionDetailById('asset1', {
          userSession: baseUserSession,
        }),
      ).rejects.toThrow('Invalid JSON');

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, jsonError);
    });

    test('should handle missing pensions', async () => {
      const jsonError = new Error('Data not found');
      const mockDataNoPensions = [] as PensionArrangement[];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockDataNoPensions),
      });

      await expect(
        getPensionDetailById('asset1', {
          userSession: baseUserSession,
        }),
      ).rejects.toThrow('Data not found');

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, jsonError);
    });
  });
});
