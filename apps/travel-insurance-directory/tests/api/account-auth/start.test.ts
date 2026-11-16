import Cookies from 'cookies';

import * as entraIdService from '@maps-react/entra-id/entraIdService';

import handler from 'pages/api/account-auth/start';
import {
  createMockReq,
  createMockRes,
  defaultJsonHeader,
  expectJsonError,
  stubCookies,
} from './testUtils';

jest.mock('@maps-react/entra-id/entraIdService');
jest.mock('cookies');

const mockedCookies = Cookies as jest.MockedClass<typeof Cookies>;
const mockedEntra = entraIdService as jest.Mocked<typeof entraIdService>;

type SignInStartSuccess = {
  success: true;
  continuation_token: string;
};

type SignInChallengeSuccess = {
  success: true;
  continuation_token: string;
};

type SignInStartUserNotFound = {
  success: false;
  error: string;
  error_description: string;
};

type SignInChallengeFailure = {
  success: false;
};

describe('/api/account-auth/start', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stubCookies(mockedCookies);
  });

  it('returns 405 for non-POST requests', async () => {
    const req = createMockReq({}, defaultJsonHeader, 'GET');
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
  });

  it('returns 400 if email missing', async () => {
    const req = createMockReq({ email: '' });
    const res = createMockRes();

    await handler(req, res);

    expectJsonError(res, 400, { email: { error: 'required' } });
  });

  it('returns 400 for invalid email format without calling Entra', async () => {
    const req = createMockReq({ email: 'not-an-email' });
    const res = createMockRes();

    await handler(req, res);

    expect(mockedEntra.startSignIn).not.toHaveBeenCalled();
    expectJsonError(res, 400, { email: { error: 'invalid' } });
  });

  it('successfully starts native sign-in and sends OTP', async () => {
    const cookieInstance = stubCookies(mockedCookies);
    mockedEntra.startSignIn.mockResolvedValue({
      success: true,
      continuation_token: 'start-token',
    } satisfies SignInStartSuccess);
    mockedEntra.getSignInChallenge.mockResolvedValue({
      success: true,
      continuation_token: 'challenge-token',
    } satisfies SignInChallengeSuccess);

    const req = createMockReq({ email: 'test@example.com' });
    const res = createMockRes();

    await handler(req, res);

    expect(mockedEntra.startSignIn).toHaveBeenCalledWith(
      'test@example.com',
      'oob redirect',
    );
    expect(mockedEntra.getSignInChallenge).toHaveBeenCalledWith(
      'test@example.com',
      'start-token',
      'oob redirect',
    );

    expect((cookieInstance.set as jest.Mock).mock.calls.length).toBeGreaterThan(
      0,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ otpSent: true, success: true });
  });

  it('returns 400 with user_not_found if startSignIn fails after valid email', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(jest.fn());
    mockedEntra.startSignIn.mockResolvedValue({
      success: false,
      error: 'invalid_grant',
      error_description: 'User not found',
    } satisfies SignInStartUserNotFound);

    const req = createMockReq({ email: 'test@example.com' });
    const res = createMockRes();

    await handler(req, res);

    expect(mockedEntra.startSignIn).toHaveBeenCalled();
    expectJsonError(res, 400, { email: { error: 'user_not_found' } });
    warnSpy.mockRestore();
  });

  it('returns 500 if getSignInChallenge fails', async () => {
    mockedEntra.startSignIn.mockResolvedValue({
      success: true,
      continuation_token: 'start-token',
    } satisfies SignInStartSuccess);
    mockedEntra.getSignInChallenge.mockResolvedValue({
      success: false,
    } satisfies SignInChallengeFailure);

    const req = createMockReq({ email: 'test@example.com' });
    const res = createMockRes();

    await handler(req, res);

    expectJsonError(res, 500, { page: { error: 'general_error' } });
  });
});
