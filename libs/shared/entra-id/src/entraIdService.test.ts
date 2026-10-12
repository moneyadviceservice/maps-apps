import {
  getChallenge,
  getSignInChallenge,
  getToken,
  startSignIn,
  startSignUp,
  submitAttributes,
  submitOtp,
  submitSignInOtp,
  submitPassword,
} from './entraIdService';
import {
  mockFetchJson,
  mockFetchJsonSequence,
} from './testUtils/mockFetchJson';

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
    mockFetchJson(mockFetch, { continuation_token: 'abc123' });

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
    expect(body).toContain('challenge_type=oob+password+redirect');
    expect(result).toEqual({ success: true, continuation_token: 'abc123' });
  });

  it('handles missing continuation_token as failure in startSignUp()', async () => {
    mockFetchJson(mockFetch, { foo: 'bar' });

    const result = await startSignUp('user@example.com');
    expect(result.success).toBe(false);
  });

  it('uses provided challenge_type and attributes in startSignUp()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'abc123' });

    await startSignUp('user@example.com', 'oob redirect', { displayName: 'X' });

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('challenge_type=oob+redirect');
    expect(decodeURIComponent(body)).toContain('"displayName":"X"');
  });

  it('sends empty attributes when omitted in startSignUp()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'abc123' });

    await startSignUp('user@example.com');

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('attributes=');
    expect(body).not.toContain('attributes=%7B');
  });

  it('calls /challenge endpoint in getChallenge()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'xyz' });

    await getChallenge('user@example.com', 'token123');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://entra.test/signup/v1.0/challenge',
      expect.any(Object),
    );
  });

  it('returns success false when getChallenge response missing continuation_token', async () => {
    mockFetchJson(mockFetch, { error: 'invalid' });

    const res = await getChallenge('user@example.com', 'token123');
    expect(res.success).toBe(false);
  });

  it('uses provided challenge_type in getChallenge()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'xyz' });

    await getChallenge('user@example.com', 'token123', 'oob redirect');

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('challenge_type=oob+redirect');
  });

  it('calls /continue with OTP params for submitOtp()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'otp-token' });

    const res = await submitOtp('user@example.com', '123456', 'cont-1');

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('grant_type=oob');
    expect(body).toContain('oob=123456');
    expect(res.success).toBe(true);
  });

  it('returns success false when submitOtp response missing continuation_token', async () => {
    mockFetchJson(mockFetch, { error: 'invalid_otp' });

    const res = await submitOtp('user@example.com', '123456', 'cont-1');
    expect(res.success).toBe(false);
  });

  it('submits attributes JSON in submitAttributes()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'attr-token' });

    await submitAttributes('user@example.com', { org: 'ABC' }, 'cont-2');

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('grant_type=attributes');
    expect(decodeURIComponent(body)).toContain('"org":"ABC"');
  });

  it('returns success false when submitAttributes response missing continuation_token', async () => {
    mockFetchJson(mockFetch, { error: 'invalid' });

    const res = await submitAttributes(
      'user@example.com',
      { org: 'ABC' },
      'cont-2',
    );
    expect(res.success).toBe(false);
  });

  it('submits password in submitPassword()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'pw-token' });

    await submitPassword('user@example.com', 'Pa$$word1', 'cont-3');

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('grant_type=password');
    expect(body).toContain('password=Pa%24%24word1');
  });

  it('returns success false when submitPassword response missing continuation_token', async () => {
    mockFetchJson(mockFetch, { error: 'invalid' });

    const res = await submitPassword('user@example.com', 'Pa$$word1', 'cont-3');
    expect(res.success).toBe(false);
  });

  it('calls /oauth2/v2.0/token in getToken()', async () => {
    mockFetchJson(mockFetch, { access_token: 'abc.def.ghi' });

    await getToken('user@example.com', 'cont-4');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://entra.test/oauth2/v2.0/token',
      expect.any(Object),
    );
  });

  it('submits default challenge_type for getChallenge()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'xyz' });

    await getChallenge('user@example.com', 'token123');
    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('challenge_type=oob+password+redirect');
  });

  it('calls correct endpoint and returns success for startSignIn()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'signin-abc' });

    const result = await startSignIn('user@example.com');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://entra.test/oauth2/v2.0/initiate',
      expect.any(Object),
    );

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('username=user%40example.com');
    expect(body).toContain('client_id=test-client-id');
    expect(body).toContain('challenge_type=oob+redirect');
    expect(result).toEqual({ success: true, continuation_token: 'signin-abc' });
  });

  it('returns success false when startSignIn response missing continuation_token', async () => {
    mockFetchJson(mockFetch, { error: 'no_user' });

    const res = await startSignIn('user@example.com');
    expect(res.success).toBe(false);
  });

  it('includes capabilities when provided in startSignIn()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'signin-abc' });

    await startSignIn('user@example.com', undefined, 'mfa_required');

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('capabilities=mfa_required');
  });

  it('does not include capabilities when omitted in startSignIn()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'signin-abc' });

    await startSignIn('user@example.com');

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).not.toContain('capabilities=');
  });

  it('uses provided challenge_type in startSignIn()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'signin-abc' });

    await startSignIn('user@example.com', 'password redirect');

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('challenge_type=password+redirect');
  });

  it('calls /oauth/v2.0/challenge endpoint in getSignInChallenge()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'challenge-ct' });

    await getSignInChallenge('user@example.com', 'token123');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://entra.test/oauth2/v2.0/challenge',
      expect.any(Object),
    );

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('challenge_type=oob+redirect');
  });

  it('returns success false when getSignInChallenge response missing continuation_token', async () => {
    mockFetchJson(mockFetch, { error: 'invalid' });

    const res = await getSignInChallenge('user@example.com', 'token123');
    expect(res.success).toBe(false);
  });

  it('uses provided challenge_type in getSignInChallenge()', async () => {
    mockFetchJson(mockFetch, { continuation_token: 'challenge-ct' });

    await getSignInChallenge(
      'user@example.com',
      'token123',
      'password redirect',
    );

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('challenge_type=password+redirect');
  });

  it('calls /oauth2/v2.0/token with OTP params for submitSignInOtp()', async () => {
    mockFetchJson(mockFetch, { id_token: 'final-id-token' });

    const res = await submitSignInOtp('123456', 'cont-1');

    const body = mockFetch.mock.calls[0][1]?.body?.toString();
    expect(body).toContain('grant_type=oob');
    expect(body).toContain('oob=123456');
    expect(body).toContain('scope=openid+offline_access');
    expect(res.success).toBe(true);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://entra.test/oauth2/v2.0/token',
      expect.any(Object),
    );
  });

  it('returns success false when submitSignInOtp response missing id_token', async () => {
    mockFetchJson(mockFetch, { token_type: 'Bearer' });

    const res = await submitSignInOtp('123456', 'cont-1');
    expect(res.success).toBe(false);
  });

  it('throws on fetch failure in fetchEntraApi()', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(startSignUp('user@example.com')).rejects.toThrow(
      'Failed to call Entra endpoint: /signup/v1.0/start',
    );
  });

  it('uses empty client_id when ENTRA_CLIENT_ID is missing (covers ?? branches)', async () => {
    delete process.env.ENTRA_CLIENT_ID;

    mockFetchJsonSequence(mockFetch, [
      { continuation_token: 'ct1' }, // startSignUp
      { continuation_token: 'ct2' }, // getChallenge
      { continuation_token: 'ct3' }, // submitOtp
      { continuation_token: 'ct4' }, // submitAttributes
      { continuation_token: 'ct5' }, // submitPassword
      { continuation_token: 'ct6' }, // startSignIn
      { continuation_token: 'ct7' }, // getSignInChallenge
      { id_token: 'id1' }, // submitSignInOtp
      { access_token: 'at1' }, // getToken
    ]);

    await startSignUp('user@example.com');
    expect(mockFetch.mock.calls[0][1]?.body?.toString()).toContain(
      'client_id=',
    );

    await getChallenge('user@example.com', 'ct1');
    expect(mockFetch.mock.calls[1][1]?.body?.toString()).toContain(
      'client_id=',
    );

    await submitOtp('user@example.com', '123456', 'ct2');
    expect(mockFetch.mock.calls[2][1]?.body?.toString()).toContain(
      'client_id=',
    );

    await submitAttributes('user@example.com', { org: 'ABC' }, 'ct3');
    expect(mockFetch.mock.calls[3][1]?.body?.toString()).toContain(
      'client_id=',
    );

    await submitPassword('user@example.com', 'Pa$$word1', 'ct4');
    expect(mockFetch.mock.calls[4][1]?.body?.toString()).toContain(
      'client_id=',
    );

    await startSignIn('user@example.com');
    expect(mockFetch.mock.calls[5][1]?.body?.toString()).toContain(
      'client_id=',
    );

    await getSignInChallenge('user@example.com', 'ct6');
    expect(mockFetch.mock.calls[6][1]?.body?.toString()).toContain(
      'client_id=',
    );

    await submitSignInOtp('123456', 'ct7');
    expect(mockFetch.mock.calls[7][1]?.body?.toString()).toContain(
      'client_id=',
    );

    await getToken('user@example.com', 'ct7');
    expect(mockFetch.mock.calls[8][1]?.body?.toString()).toContain(
      'client_id=',
    );
  });
});
