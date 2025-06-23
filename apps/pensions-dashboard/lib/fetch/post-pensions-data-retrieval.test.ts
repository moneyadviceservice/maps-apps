import {
  REQUEST_ABANDONED,
  REQUEST_FAILED,
  RESPONSE_NOT_ACCEPTED,
} from '../constants';
import { postPensionsDataRetrieval } from '../fetch';
import { getCsrfToken } from './get-csrf-token';

jest.mock('./get-csrf-token');

global.fetch = jest.fn();

describe('postPensionsDataRetrieval', () => {
  const userSessionId = 'test-session-id';
  const ticket = 'test-ticket';
  const csrfToken = 'test-csrf-token';
  const mockGetCsrfToken = getCsrfToken as jest.MockedFunction<
    typeof getCsrfToken
  >;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.MHPD_ISS = 'test-iss';
    process.env.MHPD_CLIENT_ID = 'test-client-id';
    process.env.MHPD_PENSION_DATA_SERVICE = 'http://test-service.com';
    mockGetCsrfToken.mockResolvedValue({
      token: csrfToken,
      cookie: `X-XSRF-TOKEN=${csrfToken}; Path=/; HttpOnly`,
    });
  });

  it('should return response when response status is 202 Accepted', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      status: 202,
    });

    const result = await postPensionsDataRetrieval({
      userSessionId,
      ticket,
    });

    expect(result).toEqual({ status: 202 });
    expect(fetch).toHaveBeenCalledWith(
      'http://test-service.com/pensions-data-retrieval',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          mhpdCorrelationId: userSessionId,
          userSessionId: userSessionId,
          iss: 'test-iss',
          'X-XSRF-TOKEN': csrfToken,
          Cookie: `X-XSRF-TOKEN=${csrfToken}; Path=/; HttpOnly`,
        },
        body: JSON.stringify({
          ticket,
          clientId: 'test-client-id',
        }),
      }),
    );
  });

  it('should throw an error if ISS environment variable is not set', async () => {
    delete process.env.MHPD_ISS;
    await expect(
      postPensionsDataRetrieval({
        userSessionId,
        ticket,
      }),
    ).rejects.toThrow(
      `${REQUEST_ABANDONED}: ISS environment variable is not set`,
    );
  });

  it.each`
    status | description
    ${200} | ${'OK'}
    ${201} | ${'Created'}
    ${204} | ${'No Content'}
    ${205} | ${'Reset Content'}
    ${206} | ${'Partial Content'}
    ${400} | ${'Bad Request'}
    ${401} | ${'Unauthorized'}
    ${403} | ${'Forbidden'}
    ${404} | ${'Not Found'}
    ${500} | ${'Internal Server Error'}
    ${503} | ${'Service Unavailable'}
  `('should error when $status $description', async ({ status }) => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      status,
    });

    await expect(
      postPensionsDataRetrieval({ userSessionId, ticket }),
    ).rejects.toThrow(RESPONSE_NOT_ACCEPTED);
  });

  it('should error when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error(REQUEST_FAILED));

    await expect(
      postPensionsDataRetrieval({ userSessionId, ticket }),
    ).rejects.toThrow(REQUEST_FAILED);
  });
});
