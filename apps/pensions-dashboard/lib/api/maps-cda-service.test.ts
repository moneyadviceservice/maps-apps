import {
  DATA_NOT_FOUND,
  REQUEST_ABANDONED,
  REQUEST_FAILED,
  RESPONSE_NOT_OK,
} from '../constants';
import { ClaimsGatheringResponseType } from '../types';
import {
  getClaimsGatheringRedirect,
  postRedirectDetails,
} from './maps-cda-service';

jest.mock('./shared', () => ({
  ...jest.requireActual('./shared'),
  getCsrfToken: jest.fn(),
}));

global.fetch = jest.fn();

describe('Maps CDA Service', () => {
  describe('getClaimsGatheringRedirect', () => {
    const userSessionId = 'test-session-id';
    const mockData = {
      claimsRedirectUrl: 'test-redirect-user',
      rqp: 'test-rqp',
      ticket: 'test-ticket',
      requestId: 'test-request-id',
    } as ClaimsGatheringResponseType;

    beforeEach(() => {
      process.env.MHPD_ISS = 'test-iss';
    });

    it('should return claims gathering redirect data', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await getClaimsGatheringRedirect({
        userSessionId,
      });

      expect(result).toEqual(mockData);
    });

    it('should throw an error if ISS environment variable is not set', async () => {
      delete process.env.MHPD_ISS;
      await expect(
        getClaimsGatheringRedirect({
          userSessionId,
        }),
      ).rejects.toThrow(
        `${REQUEST_ABANDONED}: ISS environment variable is not set`,
      );
    });

    it('should error when response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      await expect(
        getClaimsGatheringRedirect({ userSessionId }),
      ).rejects.toThrow(RESPONSE_NOT_OK);
    });

    it('should error when data is not found', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      });

      await expect(
        getClaimsGatheringRedirect({ userSessionId }),
      ).rejects.toThrow(DATA_NOT_FOUND);
    });

    it('should error when fetch fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error(REQUEST_FAILED));

      await expect(
        getClaimsGatheringRedirect({ userSessionId }),
      ).rejects.toThrow(REQUEST_FAILED);
    });
  });

  describe('postRedirectDetails', () => {
    const userSessionId = 'test-session-id';

    beforeEach(() => {
      jest.resetAllMocks();
      global.fetch = jest.fn();
      process.env.MHPD_ISS = 'test-iss';
      process.env.MHPD_MAPS_CDA_SERVICE = 'https://test-service.example.com';
    });

    it('should throw an error if MHPD_ISS environment variable is not set', async () => {
      // Arrange
      delete process.env.MHPD_ISS;

      // Act & Assert
      await expect(postRedirectDetails({ userSessionId })).rejects.toThrow(
        `${REQUEST_ABANDONED}: ISS environment variable is not set`,
      );
    });

    it('should throw an error if network response is not ok', async () => {
      // Arrange - Mock CSRF token success, then main request failure
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest
              .fn()
              .mockReturnValue(
                'X-XSRF-TOKEN=test-csrf-token; Path=/; HttpOnly',
              ),
          },
        })
        .mockResolvedValueOnce({
          ok: false,
        });

      // Act & Assert
      await expect(postRedirectDetails({ userSessionId })).rejects.toThrow(
        RESPONSE_NOT_OK,
      );
    });

    it('should return response if network response is ok', async () => {
      // Arrange - Mock CSRF token success, then main request success
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest
              .fn()
              .mockReturnValue(
                'X-XSRF-TOKEN=test-csrf-token; Path=/; HttpOnly',
              ),
          },
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue('test-data'),
        });

      const result = await postRedirectDetails({
        userSessionId,
      });

      // Assert
      expect(result).toEqual('test-data');
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.MHPD_MAPS_CDA_SERVICE}/redirect-details`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: 'X-XSRF-TOKEN=test-csrf-token; Path=/; HttpOnly',
            'X-XSRF-TOKEN': 'test-csrf-token',
            mhpdCorrelationId: userSessionId,
            userSessionId: userSessionId,
            iss: process.env.MHPD_ISS,
          },
          body: JSON.stringify({
            redirectPurpose: 'FIND',
          }),
        }),
      );
    });
  });
});
