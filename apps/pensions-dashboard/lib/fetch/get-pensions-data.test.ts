import {
  DATA_NOT_FOUND,
  REQUEST_FAILED,
  RESPONSE_NOT_OK,
  SESSION_EXPIRED,
} from '../constants';
import { isSessionExpired, transformPensionData } from '../utils';
import { getPensionData, UserSession } from './get-pensions-data';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

jest.mock('../utils', () => ({
  transformPensionData: jest.fn(),
  isSessionExpired: jest.fn(),
}));

const mockIsSessionExpired = isSessionExpired as jest.MockedFunction<
  typeof isSessionExpired
>;
const mockTransformPensionData = transformPensionData as jest.MockedFunction<
  typeof transformPensionData
>;

beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn();
  console.error = jest.fn(); // Mock console.error
  process.env.MHPD_ISS = 'test-iss';
  process.env.MHPD_PENSION_DATA_SERVICE = 'http://test-url.com';
  process.env.PENSIONS_DATA_RETRIEVAL_COMPLETE = '';

  // Default mock for isSessionExpired
  mockIsSessionExpired.mockResolvedValue(false);
});

describe('getPensionData', () => {
  const baseUserSession: UserSession = {
    userSessionId: 'test-session-id',
    authorizationCode: 'test-auth-code',
  };

  const fullUserSession: UserSession = {
    userSessionId: 'test-session-id',
    authorizationCode: 'test-auth-code',
    sessionStart: '1000000000',
  };

  const mockPensionPolicies = [
    {
      pensionArrangements: [
        { id: 'pension1', pensionType: 'DC' },
        { id: 'pension2', pensionType: 'DB' },
        { id: 'pension3', pensionType: 'SP' },
        { id: 'pension4', pensionType: 'AVC' },
      ],
    },
  ];

  const mockPensionData = {
    pensionsDataRetrievalComplete: true,
    pensionPolicies: mockPensionPolicies,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('session expiry checks', () => {
    test('should throw SESSION_EXPIRED error when session is expired', async () => {
      mockIsSessionExpired.mockResolvedValue(true);

      await expect(
        getPensionData({ userSession: baseUserSession }),
      ).rejects.toThrow(SESSION_EXPIRED);

      expect(mockIsSessionExpired).toHaveBeenCalledWith(undefined);
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should call isSessionExpired with sessionStart when provided', async () => {
      mockIsSessionExpired.mockResolvedValue(false);
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPensionData),
      });

      await getPensionData({ userSession: fullUserSession });

      expect(mockIsSessionExpired).toHaveBeenCalledWith('1000000000');
    });
  });

  describe('successful data retrieval', () => {
    test('should return pension data with basic user session', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPensionData),
      });

      const result = await getPensionData({
        userSession: baseUserSession,
      });

      expect(result).toEqual(mockPensionData);
      expect(mockTransformPensionData).toHaveBeenCalledTimes(4);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.MHPD_PENSION_DATA_SERVICE}/pensions-data`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            userSessionId: 'test-session-id',
            mhpdCorrelationId: 'test-session-id',
            cookie:
              'userSessionId=test-session-id; authorizationCode=test-auth-code;',
          }),
          signal: expect.any(AbortSignal),
        }),
      );
    });

    test('should return pension data with full user session', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPensionData),
      });

      const result = await getPensionData({
        userSession: fullUserSession,
      });

      expect(result).toEqual(mockPensionData);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.MHPD_PENSION_DATA_SERVICE}/pensions-data`,
        expect.objectContaining({
          headers: expect.objectContaining({
            cookie:
              'userSessionId=test-session-id; authorizationCode=test-auth-code;',
          }),
        }),
      );
    });

    test('should transform pension data for all arrangements', async () => {
      const mockDataWithMultiplePolicies = {
        pensionsDataRetrievalComplete: true,
        pensionPolicies: [
          {
            pensionArrangements: [
              { id: 'pension1', pensionType: 'DC' },
              { id: 'pension2', pensionType: 'DB' },
            ],
          },
          {
            pensionArrangements: [{ id: 'pension3', pensionType: 'SP' }],
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockDataWithMultiplePolicies),
      });

      await getPensionData({ userSession: baseUserSession });

      expect(mockTransformPensionData).toHaveBeenCalledTimes(3);
      expect(mockTransformPensionData).toHaveBeenNthCalledWith(1, {
        id: 'pension1',
        pensionType: 'DC',
      });
      expect(mockTransformPensionData).toHaveBeenNthCalledWith(2, {
        id: 'pension2',
        pensionType: 'DB',
      });
      expect(mockTransformPensionData).toHaveBeenNthCalledWith(3, {
        id: 'pension3',
        pensionType: 'SP',
      });
    });
  });

  describe('error handling', () => {
    test('should throw error when response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(
        getPensionData({ userSession: baseUserSession }),
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
        getPensionData({ userSession: baseUserSession }),
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
        getPensionData({ userSession: baseUserSession }),
      ).rejects.toThrow(DATA_NOT_FOUND);
    });

    test('should throw and log error when fetch fails', async () => {
      const fetchError = new Error('Network error');
      (fetch as jest.Mock).mockRejectedValueOnce(fetchError);

      await expect(
        getPensionData({ userSession: baseUserSession }),
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
        getPensionData({ userSession: baseUserSession }),
      ).rejects.toThrow('Invalid JSON');

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, jsonError);
    });

    test('should handle missing pensionPolicies gracefully', async () => {
      const mockDataNoPolicies = {
        pensionsDataRetrievalComplete: true,
        pensionPolicies: [],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockDataNoPolicies),
      });

      const result = await getPensionData({ userSession: baseUserSession });

      expect(result).toEqual(mockDataNoPolicies);
      expect(mockTransformPensionData).not.toHaveBeenCalled();
    });
  });
});
