import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import * as constants from 'CONSTANTS';
import Cookies from 'cookies';
import * as token from 'lib/token';
import * as validateReferrer from 'lib/validateReferrer';
import { COOKIE_OPTIONS } from 'utils/session/config';
import { getExpireTimeDate } from 'utils/session/getExpireTimeDate';

import originalHandler from './auth';

type CookiesSetFn = (name: string, value: string, options: unknown) => void;
interface MockCookiesInstance {
  set: CookiesSetFn;
  mockSet: jest.Mock<void, [string, string, unknown]>;
}
const handler: NextApiHandler = originalHandler;

process.env.SESSION_EXPIRY_TIME = '60';

jest.mock('cookies', () => {
  const mockSet: CookiesSetFn = jest.fn();
  return jest
    .fn<MockCookiesInstance, [NextApiRequest, NextApiResponse]>()
    .mockImplementation(() => ({
      set: mockSet,
      mockSet: mockSet as jest.Mock<void, [string, string, unknown]>,
    }));
});

jest.mock('lib/token', () => ({
  encrypt: jest.fn(),
  generateCSRFToken: jest.fn(),
}));

jest.mock('lib/validateReferrer', () => ({
  validateReferrer: jest.fn(),
}));

jest.mock('utils/session/getExpireTimeDate', () => ({
  getExpireTimeDate: jest.fn(),
}));

jest.mock('utils/session/config', () => ({
  COOKIE_OPTIONS: {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  },
}));

jest.mock('@maps-react/utils/rateLimitMiddleware', () => ({
  rateLimitMiddleware: (handlerFn: NextApiHandler) => handlerFn,
}));

jest.mock('CONSTANTS', () => ({
  PATHS: { LOGIN: 'login', START: 'start' },
  QUESTION_PREFIX: 'Q',
}));

const mockEncrypt = jest.mocked(token.encrypt);
const mockGenerateCSRFToken = jest.mocked(token.generateCSRFToken);
const mockValidateReferrer = jest.mocked(validateReferrer.validateReferrer);
const mockGetExpireTimeDate = jest.mocked(getExpireTimeDate);

type RequestBody = { referrerId: string; language: string };

const mockReq = (body: RequestBody): Partial<NextApiRequest> => ({
  method: 'POST',
  body,
});

const mockRes = (): Partial<NextApiResponse> => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  redirect: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
});

const getMockCookiesInstance = (): MockCookiesInstance =>
  (Cookies as unknown as jest.Mock).mock.results[0].value;
const COOKIE_OPTIONS_MOCK = COOKIE_OPTIONS;

const MOCK_SESSION_TOKEN = 'mock-session-token-encrypted';
const MOCK_CSRF_TOKEN = 'mock-csrf-token';
const MOCK_EXPIRY_DATE = new Date('2025-11-20T10:43:47.000Z');

describe('Authentication API Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockEncrypt.mockResolvedValue(MOCK_SESSION_TOKEN);
    mockGenerateCSRFToken.mockReturnValue(MOCK_CSRF_TOKEN);
    mockGetExpireTimeDate.mockReturnValue(MOCK_EXPIRY_DATE);

    mockValidateReferrer.mockResolvedValue({
      validatedReferrerId: {
        success: true,
        message: '12345678',
        correlationId: 'corr-id-123',
      },
    });
  });

  it('should successfully validate, set cookies, and redirect to the start path', async () => {
    const req = {
      body: { referrerId: '12345678', language: 'en' },
    } as NextApiRequest;
    const res = mockRes();

    await handler(req as unknown as NextApiRequest, res as NextApiResponse);

    const cookiesInstance = getMockCookiesInstance();

    expect(mockValidateReferrer).toHaveBeenCalledWith('12345678');

    expect(cookiesInstance.mockSet).toHaveBeenNthCalledWith(
      1,
      'session',
      MOCK_SESSION_TOKEN,
      COOKIE_OPTIONS_MOCK,
    );
    expect(cookiesInstance.mockSet).toHaveBeenNthCalledWith(
      2,
      'data',
      '',
      COOKIE_OPTIONS_MOCK,
    );

    expect(cookiesInstance.mockSet).toHaveBeenNthCalledWith(
      3,
      'session',
      MOCK_SESSION_TOKEN,
      {
        ...COOKIE_OPTIONS_MOCK,
        expires: MOCK_EXPIRY_DATE,
      },
    );

    expect(cookiesInstance.mockSet).toHaveBeenNthCalledWith(
      4,
      'csrfToken',
      MOCK_CSRF_TOKEN,
      {
        ...COOKIE_OPTIONS_MOCK,
        expires: MOCK_EXPIRY_DATE,
      },
    );

    expect(res.redirect).toHaveBeenCalledWith(
      307,
      `/${req.body.language}/${constants.PATHS.LOGIN}`,
    );
  });

  it('should redirect to the login path with errors on Zod validation failure', async () => {
    const invalidReferrerId = '12345';
    const language = 'es';

    const req = mockReq({ referrerId: invalidReferrerId, language });
    const res = mockRes();

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockValidateReferrer).not.toHaveBeenCalled();

    const expectedErrors = [
      {
        field: 'referrerId',
        type: 'invalid',
      },
    ];
    const expectedQuery = new URLSearchParams({
      errors: JSON.stringify(expectedErrors),
    }).toString();

    expect(res.redirect).toHaveBeenCalledWith(
      302,
      `/${language}/${constants.PATHS.LOGIN}/?${expectedQuery}`,
    );
  });

  it('should catch error from validateReferrer and redirect to login path with a generic error', async () => {
    const language = 'de';
    const validationError = { error: 'Invalid referrer' };
    mockValidateReferrer.mockResolvedValue(validationError);

    const req = mockReq({ referrerId: '99999999', language });
    const res = mockRes();

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {
        /** No empty object */
      });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockValidateReferrer).toHaveBeenCalled();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error verifying credentials:',
      validationError,
    );

    const expectedErrors = [{ field: 'referrerId', type: 'invalid' }];
    const expectedQuery = new URLSearchParams({
      errors: JSON.stringify(expectedErrors),
    }).toString();

    expect(res.redirect).toHaveBeenCalledWith(
      307,
      `/${language}/${constants.PATHS.LOGIN}/?${expectedQuery}`,
    );

    consoleErrorSpy.mockRestore();
  });
});
