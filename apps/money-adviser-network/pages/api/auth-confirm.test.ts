import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { decrypt, encrypt } from 'lib/token';
import { getExpireTimeDate } from 'utils/session/getExpireTimeDate';

import ogHandler from './auth-confirm';

const handler: NextApiHandler = ogHandler;

jest.mock('cookies');
jest.mock('lib/token', () => ({
  decrypt: jest.fn(),
  encrypt: jest.fn(),
}));
jest.mock('utils/session/getExpireTimeDate');
jest.mock('@maps-react/utils/rateLimitMiddleware', () => ({
  rateLimitMiddleware: (h: unknown) => h,
}));

describe('Organisation Confirmation Handler', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  const mockCookiesSet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (Cookies as unknown as jest.Mock).mockImplementation(() => ({
      set: mockCookiesSet,
    }));

    res = {
      redirect: jest.fn() as jest.MockedFunction<NextApiResponse['redirect']>,
    };

    process.env.SESSION_EXPIRY_TIME = '30';
    process.env.SESSION_REFRESH_TIME = '15';
  });

  type TestCase = [
    string,
    Partial<NextApiRequest>,
    string | null,
    number,
    string,
  ];

  const testCases: TestCase[] = [
    [
      'redirects to login if session cookie is missing',
      { body: { language: 'en', confirmOrganisation: true }, cookies: {} },
      null,
      302,
      '/en/login/?errors=' +
        encodeURIComponent(
          JSON.stringify([{ field: 'confirmOrganisation', type: 'required' }]),
        ),
    ],
    [
      'redirects to login if confirmOrganisation is missing',
      { body: { language: 'en' }, cookies: { session: 'valid-token' } },
      'mock-payload',
      302,
      '/en/login/?errors=',
    ],
    [
      'successfully updates session and redirects to question 1',
      {
        body: { language: 'en', confirmOrganisation: true },
        cookies: { session: 'valid-token' },
      },
      'mock-payload',
      302,
      '/en/start/q-1',
    ],
  ];

  it.each(testCases)(
    '%s',
    async (_, reqOverride, sessionPayload, expectedStatus, expectedUrlPart) => {
      req = reqOverride;

      if (sessionPayload) {
        (decrypt as jest.Mock).mockResolvedValue({ payload: { user: 'test' } });
      }
      (encrypt as jest.Mock).mockResolvedValue('new-encrypted-token');
      (getExpireTimeDate as jest.Mock).mockReturnValue(new Date());

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.redirect).toHaveBeenCalledWith(
        expectedStatus,
        expect.stringContaining(expectedUrlPart),
      );
    },
  );

  it('should handle encryption errors with 307 redirect', async () => {
    req = {
      body: { language: 'en', confirmOrganisation: true },
      cookies: { session: 'valid' },
    };
    (decrypt as jest.Mock).mockResolvedValue({ payload: { id: 1 } });
    (encrypt as jest.Mock).mockRejectedValue(new Error('Cipher failed'));

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.redirect).toHaveBeenCalledWith(
      307,
      expect.stringContaining('errors='),
    );
  });
});
