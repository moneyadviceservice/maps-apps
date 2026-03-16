import {
  getChallenge,
  getToken,
  startSignUp,
  submitAttributes,
  submitOtp,
  submitPassword,
} from './entraIdService';

describe('entraIdService', () => {
  const mockFetch = jest.fn();

  beforeAll(() => {
    globalThis.fetch = mockFetch;
  });

  beforeEach(() => {
    mockFetch.mockReset();
    process.env.ENTRA_CLIENT_URL = 'https://entra.test';
    process.env.ENTRA_CLIENT_ID = 'test-client-id';
  });

  it('calls correct endpoint and returns success for startSignUp()', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ continuation_token: 'abc123' }),
    });

    const result = await startSignUp('user@example.com');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://entra.test/signup/v1.0/start',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      }),
    );

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('username=user%40example.com');
    expect(body).toContain('client_id=test-client-id');
    expect(result).toEqual({ success: true, continuation_token: 'abc123' });
  });

  it('handles missing continuation_token as failure in startSignUp()', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ foo: 'bar' }),
    });

    const result = await startSignUp('user@example.com');
    expect(result.success).toBe(false);
  });

  it('calls /challenge endpoint in getChallenge()', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ continuation_token: 'xyz' }),
    });

    await getChallenge('user@example.com', 'token123');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://entra.test/signup/v1.0/challenge',
      expect.any(Object),
    );
  });

  it('calls /continue with OTP params for submitOtp()', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ continuation_token: 'otp-token' }),
    });

    const res = await submitOtp('user@example.com', '123456', 'cont-1');

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('grant_type=oob');
    expect(body).toContain('oob=123456');
    expect(res.success).toBe(true);
  });

  it('submits attributes JSON in submitAttributes()', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ continuation_token: 'attr-token' }),
    });

    await submitAttributes('user@example.com', { org: 'ABC' }, 'cont-2');

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('grant_type=attributes');
    expect(decodeURIComponent(body)).toContain('"org":"ABC"');
  });

  it('submits password in submitPassword()', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ continuation_token: 'pw-token' }),
    });

    await submitPassword('user@example.com', 'Pa$$word1', 'cont-3');

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('grant_type=password');
    expect(body).toContain('password=Pa%24%24word1');
  });

  it('calls /oauth2/v2.0/token in getToken()', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ access_token: 'abc.def.ghi' }),
    });

    await getToken('user@example.com', 'cont-4');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://entra.test/oauth2/v2.0/token',
      expect.any(Object),
    );
  });

  it('throws on fetch failure in fetchEntraApi()', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(startSignUp('user@example.com')).rejects.toThrow(
      'Failed to call Entra endpoint: /signup/v1.0/start',
    );
  });
});
