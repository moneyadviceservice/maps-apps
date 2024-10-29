import { postPensionsData } from './post-pensions-data';

describe('postPensionsData', () => {
  const userSessionId = 'test-session-id';
  const authorizationCode = 'test-auth-code';
  const codeVerifier = 'test-code-verifier';
  const redirectUrl = 'http://test-redirect-url.com';

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn(); // Mock fetch globally
    process.env.MHPD_ISS = 'test-iss';
    process.env.MHPD_PENSIONS_DATA_URL = 'http://test-url.com';
  });

  it('should throw an error if ISS environment variable is not set', async () => {
    // Arrange
    delete process.env.MHPD_ISS;

    // Act & Assert
    await expect(
      postPensionsData(
        userSessionId,
        authorizationCode,
        codeVerifier,
        redirectUrl,
      ),
    ).rejects.toThrow('ISS environment variable is not set');
  });

  it('should throw an error if network response is not ok', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert
    await expect(
      postPensionsData(
        userSessionId,
        authorizationCode,
        codeVerifier,
        redirectUrl,
      ),
    ).rejects.toThrow('Network response was not ok');
  });

  it('should return response if network response is ok', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
    });

    // Act
    const result = await postPensionsData(
      userSessionId,
      authorizationCode,
      codeVerifier,
      redirectUrl,
    );

    // Assert
    expect(result).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://test-url.com/pensions-data',
      expect.objectContaining({
        method: 'POST',
        headers: {
          userSessionId: userSessionId,
          iss: 'test-iss',
        },
        body: JSON.stringify({
          authorisationCode: authorizationCode,
          redirectUrl: redirectUrl,
          codeVerifier: codeVerifier,
        }),
      }),
    );
  });
});
