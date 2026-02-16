import {
  DATA_NOT_FOUND,
  PensionsCategory,
  REQUEST_ABANDONED,
  RESPONSE_NOT_ACCEPTED,
  RESPONSE_NOT_OK,
  SESSION_EXPIRED,
} from '../constants';
import { mockTimelineData } from '../mocks';
import { isSessionExpired } from '../utils/system/session';
import {
  deletePensionData,
  getPensionDetailById,
  getPensionsAnalytics,
  getPensionsByCategory,
  getPensionsStatus,
  getPensionsSummary,
  getPensionsTimeline,
  postPensionsData,
  postPensionsDataRetrieval,
} from './pension-data-service';

// Mock dependencies
jest.mock('../utils/system/session', () => ({
  isSessionExpired: jest.fn(),
}));
jest.mock('../utils/data/getPensionGroup', () => ({
  getPensionGroup: jest.fn(),
}));

jest.mock('./shared', () => ({
  ...jest.requireActual('./shared'),
  getCsrfToken: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('Pension Data Service', () => {
  const mockUserSessionId = 'test-session-id';
  const mockIsSessionExpired = isSessionExpired as jest.Mock;
  const mockFetch = fetch as jest.Mock;

  // Helper function to create CSRF token mock response
  const createCsrfTokenMockResponse = () => ({
    ok: true,
    headers: new Map([
      ['set-cookie', 'X-XSRF-TOKEN=test-csrf-token; Path=/; HttpOnly'],
    ]),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MHPD_PENSION_DATA_SERVICE = 'https://test-service.example.com';
    process.env.MHPD_ISS = 'test-iss';
    process.env.MHPD_CLIENT_ID = 'test-client-id';

    // Default mocks
    mockIsSessionExpired.mockResolvedValue(false);

    // Mock console methods
    jest.spyOn(console, 'error').mockImplementation(() => null);
    jest.spyOn(console, 'warn').mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('deletePensionData', () => {
    it('should successfully delete pension data', async () => {
      // Mock CSRF token request first, then DELETE request
      mockFetch
        .mockResolvedValueOnce(createCsrfTokenMockResponse())
        .mockResolvedValueOnce({ ok: true, status: 200 });

      await deletePensionData({ userSessionId: mockUserSessionId });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-service.example.com/csrf-token',
        expect.objectContaining({
          method: 'GET',
        }),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-service.example.com/pensions-data',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            userSessionId: mockUserSessionId,
            mhpdCorrelationId: mockUserSessionId,
            'X-XSRF-TOKEN': 'test-csrf-token',
          }),
        }),
      );
    });

    it('should handle 404 responses gracefully', async () => {
      // Mock CSRF token request first, then 404 DELETE request
      mockFetch
        .mockResolvedValueOnce(createCsrfTokenMockResponse())
        .mockResolvedValueOnce({ ok: false, status: 404 });

      await expect(
        deletePensionData({ userSessionId: mockUserSessionId }),
      ).resolves.not.toThrow();
    });

    it('should throw error for 5XX responses', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });

      await expect(
        deletePensionData({ userSessionId: mockUserSessionId }),
      ).rejects.toThrow();
      expect(console.error).toHaveBeenCalled();
    });

    it('should warn for other non-2xx responses but not throw', async () => {
      // Mock CSRF token request first, then 400 DELETE request
      mockFetch
        .mockResolvedValueOnce(createCsrfTokenMockResponse())
        .mockResolvedValueOnce({ ok: false, status: 400 });

      await expect(
        deletePensionData({ userSessionId: mockUserSessionId }),
      ).resolves.not.toThrow();
      expect(console.warn).toHaveBeenCalledWith(
        'DELETE request returned 400, continuing operation',
      );
    });
  });

  describe('getPensionDetailById', () => {
    const pensionId = 'test-pension-id';
    const mockUserSession = {
      userSessionId: mockUserSessionId,
      authorizationCode: 'test-auth-code',
      sessionStart: '2023-01-01',
    };

    it('should return pension detail when successful', async () => {
      const mockPensionData = [
        {
          id: pensionId,
          name: 'Test Pension',
          pensionAdministrator: {
            contactMethods: [],
          },
        },
      ];
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPensionData),
      });

      const result = await getPensionDetailById(pensionId, {
        userSession: mockUserSession,
      });

      expect(result).toEqual(mockPensionData[0]);
      expect(mockFetch).toHaveBeenCalledWith(
        `https://test-service.example.com/pension-detail/${pensionId}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            userSessionId: mockUserSessionId,
          }),
        }),
      );
    });

    it('should return pension detail with group when pensionCategory exists', async () => {
      const mockPensionData = [
        {
          id: pensionId,
          name: 'Test Pension',
          pensionCategory: 'CONFIRMED',
          pensionAdministrator: {
            contactMethods: [],
          },
        },
      ];
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPensionData),
      });

      const result = await getPensionDetailById(pensionId, {
        userSession: mockUserSession,
      });

      expect(result).toEqual(mockPensionData[0]);
    });

    it('should throw error when session is expired', async () => {
      mockIsSessionExpired.mockResolvedValue(true);

      await expect(
        getPensionDetailById(pensionId, { userSession: mockUserSession }),
      ).rejects.toThrow(SESSION_EXPIRED);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValue({ ok: false });

      await expect(
        getPensionDetailById(pensionId, { userSession: mockUserSession }),
      ).rejects.toThrow(RESPONSE_NOT_OK);
    });

    it('should throw error when no data is found', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      });

      await expect(
        getPensionDetailById(pensionId, { userSession: mockUserSession }),
      ).rejects.toThrow(DATA_NOT_FOUND);
    });
  });

  describe('getPensionsByCategory', () => {
    const category = PensionsCategory.CONFIRMED;
    const mockUserSession = {
      userSessionId: mockUserSessionId,
      authorizationCode: 'test-auth-code',
      sessionStart: '2023-01-01',
    };

    it('should return pensions by category when successful', async () => {
      const mockData = {
        totalContactPensions: 1,
        isPensionRetrievalComplete: true,
        arrangements: [
          [
            {
              id: '1',
              name: 'Test Pension',
              pensionAdministrator: {
                contactMethods: [],
              },
            },
          ],
        ],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await getPensionsByCategory(category, {
        userSession: mockUserSession,
      });

      expect(result).toEqual({
        ...mockData,
        arrangements: mockData.arrangements.flat(),
      });
      expect(mockFetch).toHaveBeenCalledWith(
        `https://test-service.example.com/pensions/${category}`,
        expect.objectContaining({ method: 'GET' }),
      );
    });

    it('should return pensions by category with group when pensionCategory exists', async () => {
      const mockData = {
        totalContactPensions: 1,
        isPensionRetrievalComplete: true,
        arrangements: [
          [
            {
              id: '1',
              name: 'Test Pension',
              pensionCategory: 'CONFIRMED',
              pensionAdministrator: {
                contactMethods: [],
              },
            },
          ],
        ],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await getPensionsByCategory(category, {
        userSession: mockUserSession,
      });

      expect(result).toEqual({
        ...mockData,
        arrangements: mockData.arrangements.flat(),
      });
    });

    it('should return null when pension retrieval is not complete', async () => {
      const mockData = {
        totalContactPensions: 0,
        isPensionRetrievalComplete: false,
        arrangements: [],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await getPensionsByCategory(category, {
        userSession: mockUserSession,
      });

      expect(result).toBeNull();
    });

    it('should throw error when session is expired', async () => {
      mockIsSessionExpired.mockResolvedValue(true);

      await expect(
        getPensionsByCategory(category, { userSession: mockUserSession }),
      ).rejects.toThrow(SESSION_EXPIRED);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValue({ ok: false });

      await expect(
        getPensionsByCategory(category, { userSession: mockUserSession }),
      ).rejects.toThrow(RESPONSE_NOT_OK);
    });

    it('should throw error when no data is found', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(null),
      });

      await expect(
        getPensionsByCategory(category, { userSession: mockUserSession }),
      ).rejects.toThrow(DATA_NOT_FOUND);
    });

    it('should throw error when the fetch request fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(
        getPensionsByCategory(category, { userSession: mockUserSession }),
      ).rejects.toThrow('Network error');
    });
  });

  describe('getPensionsStatus', () => {
    const mockUserSession = {
      userSessionId: mockUserSessionId,
      authorizationCode: 'test-auth-code',
      sessionStart: '2023-01-01',
    };

    it('should return pensions status when successful', async () => {
      const mockStatus = {
        status: 'COMPLETED',
        retrievalRequestTime: '2023-01-01',
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockStatus),
      });

      const result = await getPensionsStatus({ userSession: mockUserSession });

      expect(result).toEqual(mockStatus);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-service.example.com/pensions-status',
        expect.objectContaining({ method: 'GET' }),
      );
    });

    it('should throw error when session is expired', async () => {
      mockIsSessionExpired.mockResolvedValue(true);

      await expect(
        getPensionsStatus({ userSession: mockUserSession }),
      ).rejects.toThrow(SESSION_EXPIRED);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValue({ ok: false });

      await expect(
        getPensionsStatus({ userSession: mockUserSession }),
      ).rejects.toThrow(RESPONSE_NOT_OK);
    });

    it('should throw error when no data is found', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(null),
      });

      await expect(
        getPensionsStatus({ userSession: mockUserSession }),
      ).rejects.toThrow(DATA_NOT_FOUND);
    });

    it('should throw error when the fetch request fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(
        getPensionsStatus({ userSession: mockUserSession }),
      ).rejects.toThrow('Network error');
    });
  });

  describe('getPensionsSummary', () => {
    const mockUserSession = {
      userSessionId: mockUserSessionId,
      authorizationCode: 'test-auth-code',
      sessionStart: '2023-01-01',
    };

    it('should return pensions summary when successful', async () => {
      const mockSummary = {
        isPensionRetrievalComplete: true,
        totalPensionsFound: 1,
        pensions: [{ id: '1', value: 1000 }],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSummary),
      });

      const result = await getPensionsSummary({ userSession: mockUserSession });

      expect(result).toEqual(mockSummary);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-service.example.com/pensions-summary',
        expect.objectContaining({ method: 'GET' }),
      );
    });

    it('should return null when pension retrieval is not complete', async () => {
      const mockSummary = {
        isPensionRetrievalComplete: false,
        totalPensionsFound: 0,
        pensions: [],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSummary),
      });

      const result = await getPensionsSummary({ userSession: mockUserSession });

      expect(result).toBeNull();
    });

    it('should throw error when session is expired', async () => {
      mockIsSessionExpired.mockResolvedValue(true);

      await expect(
        getPensionsSummary({ userSession: mockUserSession }),
      ).rejects.toThrow(SESSION_EXPIRED);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValue({ ok: false });

      await expect(
        getPensionsSummary({ userSession: mockUserSession }),
      ).rejects.toThrow(RESPONSE_NOT_OK);
    });

    it('should throw error when no data is found', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(null),
      });

      await expect(
        getPensionsSummary({ userSession: mockUserSession }),
      ).rejects.toThrow(DATA_NOT_FOUND);
    });

    it('should throw error when the fetch request fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(
        getPensionsSummary({ userSession: mockUserSession }),
      ).rejects.toThrow('Network error');
    });
  });

  describe('postPensionsData', () => {
    const postData = {
      userSessionId: mockUserSessionId,
      authorizationCode: 'test-auth-code',
      codeVerifier: 'test-verifier',
      redirectUrl: 'https://test-redirect.com',
      clientId: 'test-client',
      clientSecret: 'test-secret',
    };

    it('should post pensions data successfully', async () => {
      // Mock CSRF token request first, then POST request
      const mockResponse = { ok: true };
      mockFetch
        .mockResolvedValueOnce(createCsrfTokenMockResponse())
        .mockResolvedValueOnce(mockResponse);

      const result = await postPensionsData(postData);

      expect(result).toBe(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-service.example.com/csrf-token',
        expect.objectContaining({
          method: 'GET',
        }),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-service.example.com/pensions-data',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            iss: 'test-iss',
            'X-XSRF-TOKEN': 'test-csrf-token',
          }),
          body: expect.stringContaining('test-auth-code'),
        }),
      );
    });

    it('should throw error when ISS environment variable is not set', async () => {
      delete process.env.MHPD_ISS;

      await expect(postPensionsData(postData)).rejects.toThrow(
        `${REQUEST_ABANDONED}: ISS environment variable is not set`,
      );
    });

    it('should throw error when response is not ok', async () => {
      // Mock CSRF token request first, then failing POST request
      mockFetch
        .mockResolvedValueOnce(createCsrfTokenMockResponse())
        .mockResolvedValueOnce({ ok: false });

      await expect(postPensionsData(postData)).rejects.toThrow(RESPONSE_NOT_OK);
    });
  });

  describe('postPensionsDataRetrieval', () => {
    const retrievalData = {
      userSessionId: mockUserSessionId,
      ticket: 'test-ticket',
    };

    it('should post pensions data retrieval successfully', async () => {
      // Mock CSRF token request first, then POST request
      const mockResponse = { status: 202 };
      mockFetch
        .mockResolvedValueOnce(createCsrfTokenMockResponse())
        .mockResolvedValueOnce(mockResponse);

      const result = await postPensionsDataRetrieval(retrievalData);

      expect(result).toBe(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-service.example.com/csrf-token',
        expect.objectContaining({
          method: 'GET',
        }),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-service.example.com/pensions-data-retrieval',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            iss: 'test-iss',
            'X-XSRF-TOKEN': 'test-csrf-token',
          }),
          body: expect.stringContaining('test-ticket'),
        }),
      );
    });

    it('should throw error when ISS environment variable is not set', async () => {
      delete process.env.MHPD_ISS;

      await expect(postPensionsDataRetrieval(retrievalData)).rejects.toThrow(
        `${REQUEST_ABANDONED}: ISS environment variable is not set`,
      );
    });

    it('should throw error when response status is not 202', async () => {
      // Mock CSRF token request first, then POST request with wrong status
      mockFetch
        .mockResolvedValueOnce(createCsrfTokenMockResponse())
        .mockResolvedValueOnce({ status: 200 });

      await expect(postPensionsDataRetrieval(retrievalData)).rejects.toThrow(
        RESPONSE_NOT_ACCEPTED,
      );
    });
  });

  describe('getPensionsAnalytics', () => {
    const mockUserSession = {
      userSessionId: mockUserSessionId,
      authorizationCode: 'test-auth-code',
      sessionStart: '2023-01-01',
    };

    it('should return analytics data when successful', async () => {
      const mockAnalyticsData = {
        totalPensions: 5,
        totalErrorPensions: 0,
        totalUnsupportedPensions: 0,
        confirmedPensions: [
          {
            externalAssetId: '123',
            schemeName: 'Test Pension',
            matchType: 'DEFN',
            pensionAdministratorName: 'Test Admin',
            pensionCategory: 'CONFIRMED',
          },
        ],
        incompletePensions: [],
        unconfirmedPensions: [],
        unsupportedPensions: [],
        erroredPensions: [],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockAnalyticsData),
      });

      const result = await getPensionsAnalytics({
        userSession: mockUserSession,
      });

      expect(result).toEqual(mockAnalyticsData);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-service.example.com/pensions/analytics',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            userSessionId: mockUserSessionId,
            mhpdCorrelationId: mockUserSessionId,
          }),
        }),
      );
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(
        getPensionsAnalytics({ userSession: mockUserSession }),
      ).rejects.toThrow('Network error');
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(
        getPensionsAnalytics({ userSession: mockUserSession }),
      ).rejects.toThrow(RESPONSE_NOT_OK);
    });

    it('should throw error when no data is returned', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(null),
      });

      await expect(
        getPensionsAnalytics({ userSession: mockUserSession }),
      ).rejects.toThrow(DATA_NOT_FOUND);
    });
  });

  describe('getPensionsTimeline', () => {
    const mockUserSession = {
      userSessionId: mockUserSessionId,
      authorizationCode: 'test-auth-code',
      sessionStart: '2023-01-01',
    };

    it('should return pensions timeline data when successful', async () => {
      const mockData = {
        isPensionRetrievalComplete: true,
        ...mockTimelineData,
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await getPensionsTimeline({
        userSession: mockUserSession,
      });

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        `https://test-service.example.com/pensions-timeline`,
        expect.objectContaining({ method: 'GET' }),
      );
    });

    it('should return null when pension retrieval is not complete', async () => {
      const mockData = {
        isPensionRetrievalComplete: false,
        ...mockTimelineData,
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await getPensionsTimeline({
        userSession: mockUserSession,
      });

      expect(result).toBeNull();
    });

    it('should throw error when session is expired', async () => {
      mockIsSessionExpired.mockResolvedValue(true);

      await expect(
        getPensionsTimeline({ userSession: mockUserSession }),
      ).rejects.toThrow(SESSION_EXPIRED);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValue({ ok: false });

      await expect(
        getPensionsTimeline({ userSession: mockUserSession }),
      ).rejects.toThrow(RESPONSE_NOT_OK);
    });

    it('should throw error when no data is found', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(null),
      });

      await expect(
        getPensionsTimeline({ userSession: mockUserSession }),
      ).rejects.toThrow(DATA_NOT_FOUND);
    });

    it('should throw error when the fetch request fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(
        getPensionsTimeline({ userSession: mockUserSession }),
      ).rejects.toThrow('Network error');
    });
  });
});
