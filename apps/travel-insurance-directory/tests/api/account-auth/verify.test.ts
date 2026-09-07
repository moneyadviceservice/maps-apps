import type { NextApiHandler, NextApiRequest } from 'next';

import Cookies from 'cookies';
import handler from 'pages/api/account-auth/verify';

import * as entraIdService from '@maps-react/entra-id/entraIdService';

import {
  createMockRes,
  defaultJsonHeader,
  expectJsonError,
  JsonObject,
  stubCookies,
} from './testUtils';

jest.mock('@maps-react/entra-id/entraIdService');
jest.mock('cookies');

jest.mock('lib/accountAuth/withAccountSession', () => ({
  withAccountSession: (fn: NextApiHandler) => fn,
}));

jest.mock('lib/account/resolveAccountMainFirm', () => ({
  resolveAccountMainFirm: jest.fn().mockResolvedValue({ firm: null }),
}));

jest.mock('lib/ci/ensureSelfServeE2eFirm', () => ({
  ensureSelfServeE2eFirm: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('lib/register/syncRegistrationSessionFromFirm', () => ({
  syncRegistrationSessionFromFirm: jest.fn().mockReturnValue(false),
}));

const mockedCookies = Cookies as jest.MockedClass<typeof Cookies>;
const mockedEntra = entraIdService as jest.Mocked<typeof entraIdService>;

type MockNextApiRequestWithSession = NextApiRequest & {
  session: { save: jest.Mock; destroy: jest.Mock; [key: string]: unknown };
};

function createMockReq<TBody extends JsonObject>(
  body: TBody,
  headers = defaultJsonHeader,
  method = 'POST',
): MockNextApiRequestWithSession {
  return {
    method,
    body,
    headers,
    session: {
      save: jest.fn().mockResolvedValue(undefined),
      destroy: jest.fn(),
    },
  } as unknown as MockNextApiRequestWithSession;
}

describe('/api/account-auth/verify', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Method handling', () => {
    it('returns 405 for non-POST requests', async () => {
      stubCookies(mockedCookies, 'ct');
      const req = createMockReq({}, defaultJsonHeader, 'GET');
      const res = createMockRes();

      await handler(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
      expectJsonError(res, 405, { page: { error: 'general_error' } });
    });
  });

  describe('OTP verification flow', () => {
    it('returns 400 if email is missing', async () => {
      stubCookies(mockedCookies, 'continuation-token');
      const req = createMockReq({ email: '', otp: '123456' });
      const res = createMockRes();

      await handler(req, res);

      expectJsonError(res, 400, { email: { error: 'required' } });
    });

    it('returns 400 if otp is missing', async () => {
      stubCookies(mockedCookies, 'continuation-token');
      const req = createMockReq({ email: 'test@example.com', otp: '' });
      const res = createMockRes();

      await handler(req, res);

      expectJsonError(res, 400, { otp: { error: 'required' } });
    });

    it('returns 400 if otp is too short', async () => {
      stubCookies(mockedCookies, 'continuation-token');
      const req = createMockReq({ email: 'test@example.com', otp: '123' });
      const res = createMockRes();

      await handler(req, res);

      expectJsonError(res, 400, { otp: { error: 'invalid' } });
    });

    it('returns 400 if continuation token is missing', async () => {
      stubCookies(mockedCookies);
      const req = createMockReq({ email: 'test@example.com', otp: '123456' });
      const res = createMockRes();

      await handler(req, res);

      expectJsonError(res, 400, { otp: { error: 'expired_token' } });
    });

    it('returns 500 if submitSignInOtp does not return id_token', async () => {
      stubCookies(mockedCookies, 'continuation-token');

      mockedEntra.submitSignInOtp.mockResolvedValue({
        success: false,
      });

      const req = createMockReq({ email: 'test@example.com', otp: '123456' });
      const res = createMockRes();

      await handler(req, res);

      expectJsonError(res, 500, { page: { error: 'general_error' } });
    });

    it('returns 400 otp invalid_grant when Entra responds invalid_grant', async () => {
      stubCookies(mockedCookies, 'continuation-token');

      mockedEntra.submitSignInOtp.mockResolvedValue({
        success: false,
        error: 'invalid_grant',
      });

      const req = createMockReq({ email: 'test@example.com', otp: '123456' });
      const res = createMockRes();

      await handler(req, res);

      expectJsonError(res, 400, { otp: { error: 'invalid_grant' } });
    });

    it('returns 400 otp expired_token when Entra responds CodeExpired (AADSTS70019)', async () => {
      const cookieInstance = stubCookies(mockedCookies, 'continuation-token');

      mockedEntra.submitSignInOtp.mockResolvedValue({
        success: false,
        error: 'invalid_grant',
        error_codes: [70019],
        error_description:
          'AADSTS70019: CodeExpired - Verification code expired. Trace ID: x Correlation ID: y Timestamp: 2026-01-01 00:00:00Z',
      });

      mockedEntra.startSignIn.mockResolvedValue({
        success: true,
        continuation_token: 'new-continuation-from-start',
      });
      mockedEntra.getSignInChallenge.mockResolvedValue({
        success: true,
        continuation_token: 'new-continuation-from-challenge',
      });

      const req = createMockReq({ email: 'test@example.com', otp: '123456' });
      const res = createMockRes();

      await handler(req, res);

      expect(mockedEntra.startSignIn).toHaveBeenCalledWith(
        'test@example.com',
        'oob redirect',
      );
      expect(mockedEntra.getSignInChallenge).toHaveBeenCalledWith(
        'test@example.com',
        'new-continuation-from-start',
        'oob redirect',
      );
      expect(
        (cookieInstance.set as jest.Mock).mock.calls.length,
      ).toBeGreaterThan(0);
      expectJsonError(res, 400, { otp: { error: 'expired_token' } });
    });

    it('still returns expired_token when CodeExpired resend attempt fails', async () => {
      stubCookies(mockedCookies, 'continuation-token');

      mockedEntra.submitSignInOtp.mockResolvedValue({
        success: false,
        error: 'invalid_grant',
        error_codes: [70019],
        error_description:
          'AADSTS70019: CodeExpired - Verification code expired.',
      });

      mockedEntra.startSignIn.mockRejectedValueOnce(new Error('entra down'));

      const req = createMockReq({ email: 'test@example.com', otp: '123456' });
      const res = createMockRes();

      await handler(req, res);

      expectJsonError(res, 400, { otp: { error: 'expired_token' } });
    });

    it('successfully verifies OTP and creates account session', async () => {
      const cookieInstance = stubCookies(mockedCookies, 'continuation-token');

      mockedEntra.submitSignInOtp.mockResolvedValue({
        success: true,
        id_token: 'final-id-token',
      });

      const req = createMockReq({ email: 'test@example.com', otp: '123456' });
      const res = createMockRes();

      await handler(req, res);

      expect(mockedEntra.submitSignInOtp).toHaveBeenCalledWith(
        '123456',
        'continuation-token',
      );

      expect(req.session.isAccountAuthenticated).toBe(true);
      expect(req.session.accountEmail).toBe('test@example.com');
      expect(req.session.accountIdToken).toBe('final-id-token');
      expect(req.session.save).toHaveBeenCalled();

      expect(
        (cookieInstance.set as jest.Mock).mock.calls.length,
      ).toBeGreaterThan(0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });
});
