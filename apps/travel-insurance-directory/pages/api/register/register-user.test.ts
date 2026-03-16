jest.mock(
  'utils/api/saveRegisterProgress',
  () => ({
    saveRegisterProgress: jest.fn(),
  }),
  { virtual: true },
);

import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { IronSessionObject } from 'types/iron-session';
import { saveRegisterProgress } from 'utils/api/saveRegisterProgress';
import { validateCreateUser } from 'utils/validation/validateCreateUser';

import * as entraIdService from '@maps-react/entra-id/entraIdService';

import handler from './register-user';

jest.mock('lib/sessions/withIronSession', () => ({
  withIronSession: (
    fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  ) => fn,
}));

jest.mock('lib/sessions/registerSessionOptions', () => ({
  registerSessionOptions: {},
}));

jest.mock('@maps-react/entra-id/entraIdService');
jest.mock('cookies');
jest.mock('utils/validation/validateCreateUser');

const mockedValidateCreateUser = validateCreateUser as jest.MockedFunction<
  typeof validateCreateUser
>;

const mockedCookies = Cookies as jest.MockedClass<typeof Cookies>;
const mockedEntra = entraIdService as jest.Mocked<typeof entraIdService>;

const mockedSaveRegisterProgress = saveRegisterProgress as jest.Mock;

function createMockRes(): NextApiResponse {
  const res: Partial<NextApiResponse> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res as NextApiResponse;
}

type JsonObject = { [key: string]: unknown };

type MockNextApiRequestWithSession = NextApiRequest & {
  session: Partial<IronSessionObject>;
};

const defaultHeader = {
  'content-type': 'application/json',
};
function createMockReq<TBody extends JsonObject>(
  body: TBody,
  headers = defaultHeader,
  method = 'POST',
): MockNextApiRequestWithSession {
  return {
    method,
    body,
    headers,
    session: {
      save: jest.fn().mockResolvedValue(undefined),
      destroy: jest.fn(),
      fcaData: { frnNumber: 'abcdef' },
    },
  } as unknown as MockNextApiRequestWithSession;
}

function mockCookies(getValue?: string) {
  mockedCookies.mockImplementation(
    () =>
      ({
        get: jest.fn().mockReturnValue(getValue),
        set: jest.fn(),
      } as unknown as Cookies),
  );
}

const successMockBody = {
  mail: 'test@example.com',
  givenName: 'Test',
  surname: 'User',
  jobTitle: 'Dev',
  phone: '07362541123',
  individualReferenceNumber: 'IRN123',
  confirmation: 'on',
};

const successMockCreateUserValidation = {
  ok: true,
  fields: {
    mail: { ok: true },
    givenName: { ok: true },
    surname: { ok: true },
    jobTitle: { ok: true },
    phone: { ok: true },
    individualReferenceNumber: { ok: true },
    confirmation: { ok: true },
  },
  error: false,
};

describe('Sign-up API handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedValidateCreateUser.mockResolvedValueOnce(
      successMockCreateUserValidation,
    );
  });

  describe('Method handling', () => {
    it('returns 405 for non-POST requests', async () => {
      const req = createMockReq({}, defaultHeader, 'GET');
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        fields: {
          page: {
            error: 'general_error',
          },
        },
        ok: false,
      });
    });
  });

  describe('Initial sign-up flow', () => {
    it('successfully starts signup and sends OTP', async () => {
      mockCookies();

      mockedEntra.startSignUp.mockResolvedValue({
        success: true,
        continuation_token: 'start-token',
      });

      mockedEntra.getChallenge.mockResolvedValue({
        success: true,
        continuation_token: 'challenge-token',
      });

      const req = createMockReq(successMockBody);

      const res = createMockRes();

      await handler(req, res);

      expect(mockedEntra.startSignUp).toHaveBeenCalledWith(
        'test@example.com',
        'oob redirect',
        expect.objectContaining({
          displayName: 'Test User',
        }),
      );

      expect(mockedEntra.getChallenge).toHaveBeenCalledWith(
        'test@example.com',
        'start-token',
        'oob',
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ otpSent: true, success: true });
    });

    it('returns 400 if startSignUp fails', async () => {
      mockCookies();

      mockedEntra.startSignUp.mockResolvedValue({
        success: false,
        error: 'email_exists',
      });

      const req = createMockReq(successMockBody);
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        fields: {
          mail: {
            error: 'email_exists',
          },
        },
        ok: false,
      });
    });

    it('returns 500 if getChallenge fails', async () => {
      mockCookies();

      mockedEntra.startSignUp.mockResolvedValue({
        success: true,
        continuation_token: 'start-token',
      });

      mockedEntra.getChallenge.mockResolvedValue({
        success: false,
      });

      const req = createMockReq(successMockBody);
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        fields: {
          page: {
            error: 'general_error',
          },
        },
        ok: false,
      });
    });
  });

  describe('OTP verification flow', () => {
    it('successfully verifies OTP and returns id_token', async () => {
      mockCookies('continuation-token');

      mockedEntra.submitOtp.mockResolvedValue({
        success: true,
        continuation_token: 'otp-token',
      });

      mockedEntra.getToken.mockResolvedValue({
        id_token: 'final-id-token',
      });

      mockedSaveRegisterProgress.mockResolvedValue({
        success: true,
        response: { id: 'firm-123' },
      });

      const req = createMockReq({
        ...successMockBody,
        otp: '123456',
      });
      const res = createMockRes();

      await handler(req, res);

      expect(mockedEntra.submitOtp).toHaveBeenCalledWith(
        'test@example.com',
        '123456',
        'continuation-token',
      );

      expect(mockedEntra.getToken).toHaveBeenCalledWith(
        'test@example.com',
        'otp-token',
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        id_token: 'final-id-token',
      });
    });

    it('returns 400 if continuation token is missing', async () => {
      mockCookies();

      const req = createMockReq({
        ...successMockBody,
        otp: '123456',
      });
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        fields: {
          page: {
            error: 'general_error',
          },
        },
        ok: false,
      });
    });

    it('restarts signup if OTP token is expired', async () => {
      mockCookies('old-token');

      mockedEntra.submitOtp.mockResolvedValue({
        success: false,
        error: 'expired_token',
      });

      mockedEntra.startSignUp.mockResolvedValue({
        success: true,
        continuation_token: 'new-start-token',
      });

      mockedEntra.getChallenge.mockResolvedValue({
        success: true,
        continuation_token: 'new-challenge-token',
      });

      const req = createMockReq({
        ...successMockBody,
        otp: '123456',
      });
      const res = createMockRes();

      await handler(req, res);

      expect(mockedEntra.startSignUp).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        fields: {
          otp: {
            error: 'expired_token',
          },
        },
        ok: false,
      });
    });

    it('returns 400 for invalid OTP', async () => {
      mockCookies('token');

      mockedEntra.submitOtp.mockResolvedValue({
        success: false,
        error: 'invalid_otp',
      });

      const req = createMockReq({
        ...successMockBody,
        otp: '000000',
      });
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        fields: {
          otp: {
            error: 'invalid_otp',
          },
        },
        ok: false,
      });
    });
  });

  describe('Unexpected errors', () => {
    it('returns 500 on unhandled exception', async () => {
      mockCookies();

      mockedEntra.startSignUp.mockRejectedValue(new Error('boom'));

      const req = createMockReq({
        mail: 'test@example.com',
      });
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        fields: {
          page: {
            error: 'general_error',
          },
        },
        ok: false,
      });
    });
  });
});
