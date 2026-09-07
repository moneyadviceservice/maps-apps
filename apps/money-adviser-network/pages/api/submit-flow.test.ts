import { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { createMocks } from 'node-mocks-http';
import { checkSessionValidity } from 'utils/session/checkSessionValidity';
import { COOKIE_OPTIONS } from 'utils/session/config';

import { decrypt, encrypt } from '../../lib/token';
import handler, {
  getUserFromCookies,
  invalidateSession,
  User,
} from './submit-flow';

globalThis.fetch = jest.fn();

const mockFetch = fetch as jest.Mock;

jest.mock('CONSTANTS', () => ({
  PAGES: {
    CALL_SCHEDULED: 'call-scheduled',
    CONFIRM_ANSWERS: 'confirm-answers',
  },
}));

jest.mock('../../utils/getCurrentPath', () => ({
  getCurrentPath: jest.fn(() => 'test_flow'),
}));

jest.mock('../../lib/token', () => ({
  decrypt: jest.fn(() =>
    Promise.resolve({
      payload: {
        organisationName: 'Default Org',
        referrerId: '1',
        organisationConfirmed: true,
      },
    }),
  ),
  encrypt: jest.fn(),
}));

jest.mock('cookies');
jest.mock('utils/session/checkSessionValidity');

const csrfToken =
  '3da268fa652f6230c91ed28d0766315780e001ac84fdaa44107b8741983f5220';

jest.useFakeTimers();

const mockUser: User = { referrerId: 'user-123' };
const mockSession = { payload: mockUser };

describe('Handler API', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.BOOK_APPOINTMENT_SLOT_CODE = 'test_code';
    process.env.APPOINTMENTS_API = 'https://api.example.com/';
  });

  afterEach(() => {
    jest.advanceTimersByTime(60 * 1001);
  });

  it('should return 400 if required env variables are missing', async () => {
    delete process.env.BOOK_APPOINTMENT_SLOT_CODE;
    delete process.env.APPOINTMENTS_API;

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        urlData: '{}',
        language: 'en',
        currentFlow: 'test_flow',
        csrfToken,
      },
      cookies: { csrfToken },
    });

    handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(400);
  });

  it('should return 302 if slot format is invalid', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        cookieData: JSON.stringify({
          timeSlot: { value: 'InvalidSlot' },
        }),
        urlData: '{}',
        language: 'en',
        currentFlow: 'test_flow',
        csrfToken,
      },
      cookies: { csrfToken },
    });

    handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(302);
  });

  it('should redirect on successful booking', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({}),
    });

    const flows = [
      { flow: 'start', data: {} },
      { flow: 'telephone', data: { timeSlot: { value: 'AM - 10-12-2024' } } },
      { flow: 'online', data: {} },
    ];

    flows.forEach(async ({ flow, data }) => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          cookieData: JSON.stringify(data),
          urlData: '{}',
          language: 'en',
          currentFlow: flow,
          csrfToken,
        },
        cookies: {
          csrfToken,
          session: 'mock-success-cookie',
        },
      });

      res.setHeader('Location', `/${'en'}/${flow}/${'call-scheduled'}`);
      res.status(302).end();

      (decrypt as jest.Mock).mockResolvedValue(mockSession);
      (checkSessionValidity as jest.Mock).mockResolvedValue(true);

      handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse,
      );

      expect(res._getStatusCode()).toBe(302);
      expect(res._getHeaders().location).toBe(`/en/${flow}/call-scheduled`);
    });
  });

  it('should redirect with error on booking failure', async () => {
    mockFetch.mockResolvedValue({
      status: 500,
      text: async () => 'Internal Server Error',
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        cookieData: JSON.stringify({
          timeSlot: { value: 'AM - 10-12-2024' },
        }),
        urlData: '{}',
        language: 'en',
        currentFlow: 'test_flow',
        csrfToken,
      },
      cookies: { csrfToken, session: 'session-mock' },
    });

    (decrypt as jest.Mock).mockResolvedValue(mockSession);
    (checkSessionValidity as jest.Mock).mockResolvedValue(true);

    handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    res.setHeader(
      'Location',
      `/${'en'}/${'test_flow'}/${'confirm-answers'}?error=Failed%20to%20book%20slot%3A%20500%20Internal%20Server%20Error'`,
    );
    res.status(302).end();

    expect(res._getStatusCode()).toBe(302);
    expect(res._getHeaders().location).toContain(
      'confirm-answers?error=Failed%20to%20book%20slot%3A%20500%20Internal%20Server%20Error',
    );
  });

  it('should return 403 if csrf token does not match', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        urlData: '{}',
        language: 'en',
        currentFlow: 'test_flow',
        csrfToken,
      },
      cookies: {
        csrfToken:
          '1da268fa552f6230c91ed28d0766315780e001ac84fdaa44107b8741983f5229',
      },
    });

    handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(403);
  });
});

describe('getUserFromCookies', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {
      /** No empty */
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return user payload if session is valid', async () => {
    const req = {
      cookies: { session: 'valid-token' },
    } as Partial<NextApiRequest>;

    (decrypt as jest.Mock).mockResolvedValue(mockSession);
    (checkSessionValidity as jest.Mock).mockResolvedValue(true);

    const result = await getUserFromCookies(req as NextApiRequest);

    expect(result).toEqual(mockUser);
    expect(checkSessionValidity).toHaveBeenCalledWith(mockSession);
  });

  it.each([
    {
      desc: 'missing session cookie',
      cookies: {},
      mockSetup: () => {
        /** No empty */
      },
      expected: { error: 'No session' },
    },
    {
      desc: 'invalid session (checkSessionValidity fails)',
      cookies: { session: 'token' },
      mockSetup: () => {
        (decrypt as jest.Mock).mockResolvedValue(mockSession);
        (checkSessionValidity as jest.Mock).mockResolvedValue(false);
      },
      expected: { error: 'Invalid user session' },
    },
    {
      desc: 'decryption exception',
      cookies: { session: 'corrupt' },
      mockSetup: () => {
        (decrypt as jest.Mock).mockRejectedValue(new Error('Cipher error'));
      },
      expected: { error: 'Invalid user session' },
    },
  ])(
    'returns $expected.error when $desc',
    async ({ cookies, mockSetup, expected }) => {
      const req = { cookies } as Partial<NextApiRequest>;
      mockSetup();

      const result = await getUserFromCookies(req as NextApiRequest);
      expect(result).toEqual(expected);
    },
  );
});

describe('invalidateSession', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  const mockCookiesSet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (Cookies as unknown as jest.Mock).mockImplementation(() => ({
      set: mockCookiesSet,
    }));

    req = {};
    res = {};
  });

  it('should delete organisationName and set a new encrypted session cookie', async () => {
    const expiryDate = new Date();
    const userSession: User = {
      referrerId: 'user-123',
      organisationName: 'Company XYZ',
      expires: expiryDate,
    };

    const mockEncryptedToken = 'new-encrypted-token';
    (encrypt as jest.Mock).mockResolvedValue(mockEncryptedToken);

    const result = await invalidateSession(
      req as NextApiRequest,
      res as NextApiResponse,
      userSession,
    );

    expect(encrypt).toHaveBeenCalledWith({
      userSession: expect.not.objectContaining({
        organisationName: 'Company XYZ',
      }),
    });

    expect(mockCookiesSet).toHaveBeenCalledWith('session', mockEncryptedToken, {
      ...COOKIE_OPTIONS,
      expires: expiryDate,
    });

    expect(result).toBe('success');
    expect(userSession.organisationName).toBeUndefined();
  });

  it('should throw if encryption fails', async () => {
    const userSession: User = { referrerId: '1', expires: new Date() };
    (encrypt as jest.Mock).mockRejectedValue(new Error('Encryption failed'));

    await expect(
      invalidateSession(
        req as NextApiRequest,
        res as NextApiResponse,
        userSession,
      ),
    ).rejects.toThrow('Encryption failed');
  });
});
