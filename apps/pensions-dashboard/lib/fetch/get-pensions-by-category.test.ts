import {
  DATA_NOT_FOUND,
  PensionsCategory,
  REQUEST_FAILED,
  RESPONSE_NOT_OK,
  SESSION_EXPIRED,
} from '../constants';
import {
  baseUserSession,
  fullUserSession,
  mockPensionsByCategory,
} from '../mocks/api';
import { isSessionExpired, setupCommonMocks } from '../utils';
import { getPensionsByCategory } from './get-pensions-by-category';

jest.mock('../utils/isSessionExpired', () => ({
  isSessionExpired: jest.fn(),
}));

const mockIsSessionExpired = isSessionExpired as jest.MockedFunction<
  typeof isSessionExpired
>;

describe('getPensionsByCategory', () => {
  beforeEach(() => {
    setupCommonMocks();
    mockIsSessionExpired.mockResolvedValue(false);
  });

  describe('session expiry checks', () => {
    test('should throw SESSION_EXPIRED error when session is expired', async () => {
      mockIsSessionExpired.mockResolvedValue(true);

      await expect(
        getPensionsByCategory(PensionsCategory.CONFIRMED, {
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
        json: jest.fn().mockResolvedValueOnce(mockPensionsByCategory),
      });

      await getPensionsByCategory(PensionsCategory.CONFIRMED, {
        userSession: fullUserSession,
      });

      expect(mockIsSessionExpired).toHaveBeenCalledWith('1000000000');
    });
  });

  describe('successful data retrieval', () => {
    test('should return pensions by category data with basic user session', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPensionsByCategory),
      });

      const result = await getPensionsByCategory(PensionsCategory.CONFIRMED, {
        userSession: baseUserSession,
      });

      expect(result).toEqual(mockPensionsByCategory);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.MHPD_PENSION_DATA_SERVICE}/pensions/${PensionsCategory.CONFIRMED}`,
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

    test('should return pensions by category data with full user session', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPensionsByCategory),
      });

      const result = await getPensionsByCategory(PensionsCategory.CONFIRMED, {
        userSession: fullUserSession,
      });

      expect(result).toEqual(mockPensionsByCategory);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.MHPD_PENSION_DATA_SERVICE}/pensions/${PensionsCategory.CONFIRMED}`,
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
        getPensionsByCategory(PensionsCategory.CONFIRMED, {
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
        getPensionsByCategory(PensionsCategory.CONFIRMED, {
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
        getPensionsByCategory(PensionsCategory.CONFIRMED, {
          userSession: baseUserSession,
        }),
      ).rejects.toThrow(DATA_NOT_FOUND);
    });

    test('should throw and log error when fetch fails', async () => {
      const fetchError = new Error('Network error');
      (fetch as jest.Mock).mockRejectedValueOnce(fetchError);

      await expect(
        getPensionsByCategory(PensionsCategory.CONFIRMED, {
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
        getPensionsByCategory(PensionsCategory.CONFIRMED, {
          userSession: baseUserSession,
        }),
      ).rejects.toThrow('Invalid JSON');

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, jsonError);
    });

    test('should handle missing pensions gracefully', async () => {
      const mockDataNoPensions = {
        totalContactPensions: 1,
        pensionsDataRetrievalComplete: true,
        arrangements: [],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockDataNoPensions),
      });

      const result = await getPensionsByCategory(PensionsCategory.CONFIRMED, {
        userSession: baseUserSession,
      });

      expect(result).toEqual(mockDataNoPensions);
    });
  });
});
