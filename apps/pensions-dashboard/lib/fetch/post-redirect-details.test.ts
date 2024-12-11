import { RESPONSE_NOT_OK } from '../constants';
import { postRedirectDetails } from './post-redirect-details';

describe('postRedirectDetails', () => {
  const userSessionId = 'test-session-id';
  const mhpdCorrelationId = '9e4506f7-647c-4e01-b6de-770859bbcf46';
  const redirectPurpose = 'FIND';

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
    process.env.MHPD_ISS = 'test-iss';
    process.env.MHPD_REDIRECT_DETAILS_URL = 'http://test-url.com';
  });

  afterEach(() => {
    jest.spyOn(console, 'error').mockRestore();
  });

  it('should throw an error if network response is not ok', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert
    await expect(
      postRedirectDetails({ userSessionId, mhpdCorrelationId }),
    ).rejects.toThrow(RESPONSE_NOT_OK);
  });

  it('should return response if network response is ok', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue('test-data'),
    });

    // Act
    const result = await postRedirectDetails({
      userSessionId,
      mhpdCorrelationId,
    });

    // Assert
    expect(result).toEqual('test-data');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://test-url.com/redirect-details',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          mhpdCorrelationId: mhpdCorrelationId,
        },
        body: JSON.stringify({
          redirectPurpose: redirectPurpose,
          userSessionId: userSessionId,
          iss: process.env.MHPD_ISS,
        }),
      }),
    );
  });

  it('should return response without mhpdCorrelationId if not provided', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue('test-data'),
    });

    // Act
    const result = await postRedirectDetails({ userSessionId });

    // Assert
    expect(result).toEqual('test-data');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://test-url.com/redirect-details',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          redirectPurpose: redirectPurpose,
          userSessionId: userSessionId,
          iss: process.env.MHPD_ISS,
        }),
      }),
    );
  });
});
