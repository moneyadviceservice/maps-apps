import { REQUEST_ABANDONED, RESPONSE_NOT_OK } from '../constants';
import { postPensionsData } from './post-pensions-data';

describe('postPensionsData', () => {
  const userSessionId = 'test-session-id';
  const authorizationCode = 'test-auth-code';
  const codeVerifier = 'test-code-verifier';
  const redirectUrl = 'http://test-redirect-url.com';
  const clientId = '9e4506f7-647c-4e01-b6de-770859bbcf46';
  const clientSecret = '9e4506f7-647c-4e01-b6de-770859bbcf46';

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn(); // Mock fetch globally
    process.env.MHPD_ISS = 'test-iss';
    process.env.MHPD_PENSION_DATA_SERVICE = 'http://test-url.com';
  });

  it('should throw an error if ISS environment variable is not set', async () => {
    // Arrange
    delete process.env.MHPD_ISS;

    // Act & Assert
    await expect(
      postPensionsData({
        userSessionId,
        authorizationCode,
        codeVerifier,
        redirectUrl,
        clientId,
        clientSecret,
      }),
    ).rejects.toThrow(
      `${REQUEST_ABANDONED}: ISS environment variable is not set`,
    );
  });

  it('should throw an error if network response is not ok', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert
    await expect(
      postPensionsData({
        userSessionId,
        authorizationCode,
        codeVerifier,
        redirectUrl,
        clientId,
        clientSecret,
      }),
    ).rejects.toThrow(RESPONSE_NOT_OK);
  });

  it('should return response if network response is ok', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
    });

    // Act
    const result = await postPensionsData({
      userSessionId,
      authorizationCode,
      codeVerifier,
      redirectUrl,
      clientId,
      clientSecret,
    });

    // Assert
    expect(result).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://test-url.com/pensions-data',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          userSessionId: userSessionId,
          iss: 'test-iss',
          mhpdCorrelationId: userSessionId,
        },
        body: JSON.stringify({
          authorisationCode: authorizationCode,
          redirectUrl: redirectUrl,
          codeVerifier: codeVerifier,
          clientId: clientId,
          clientSecret: clientSecret,
        }),
      }),
    );
  });
});
