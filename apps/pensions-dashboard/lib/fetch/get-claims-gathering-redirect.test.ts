import {
  DATA_NOT_FOUND,
  REQUEST_ABANDONED,
  REQUEST_FAILED,
  RESPONSE_NOT_OK,
} from '../constants';
import { getClaimsGatheringRedirect } from '../fetch';
import { ClaimsGatheringResponseType } from '../types';

global.fetch = jest.fn();

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

    await expect(getClaimsGatheringRedirect({ userSessionId })).rejects.toThrow(
      RESPONSE_NOT_OK,
    );
  });

  it('should error when data is not found', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    });

    await expect(getClaimsGatheringRedirect({ userSessionId })).rejects.toThrow(
      DATA_NOT_FOUND,
    );
  });

  it('should error when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error(REQUEST_FAILED));

    await expect(getClaimsGatheringRedirect({ userSessionId })).rejects.toThrow(
      REQUEST_FAILED,
    );
  });
});
