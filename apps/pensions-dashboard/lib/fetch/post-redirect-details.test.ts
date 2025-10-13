import { REQUEST_ABANDONED, RESPONSE_NOT_OK } from '../constants';
import { getCsrfToken } from './get-csrf-token';
import { postRedirectDetails } from './post-redirect-details';

jest.mock('./get-csrf-token');

describe('postRedirectDetails', () => {
  const userSessionId = 'test-session-id';
  const mockGetCsrfToken = getCsrfToken as jest.MockedFunction<
    typeof getCsrfToken
  >;

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
    process.env.MHPD_ISS = 'test-iss';
    process.env.MHPD_MAPS_CDA_SERVICE = 'http://test-url.com';
    mockGetCsrfToken.mockResolvedValue({
      token: 'test-csrf-token',
      cookie: 'X-XSRF-TOKEN=test-csrf-token; Path=/; HttpOnly',
    });
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
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert
    await expect(postRedirectDetails({ userSessionId })).rejects.toThrow(
      RESPONSE_NOT_OK,
    );
  });

  it('should return response if network response is ok', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
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
