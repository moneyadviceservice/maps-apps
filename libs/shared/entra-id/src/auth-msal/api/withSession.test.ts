import { NextApiRequest, NextApiResponse } from 'next';

import { withSession } from './withSession';

const mockGetSession = jest.fn();
const sessionCookieConfig = {
  password: 'secret',
  cookieName: 'test',
  cookieOptions: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
  },
};

describe('withSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('attaches session to req and calls handler', async () => {
    const mockSession = { save: jest.fn(), destroy: jest.fn() };
    mockGetSession.mockResolvedValue(mockSession);

    const handler = jest.fn().mockResolvedValue(undefined);
    const wrapped = withSession(handler, {
      getSession: mockGetSession,
      sessionCookieConfig,
    });

    const req = {} as NextApiRequest;
    const res = {} as NextApiResponse;

    await wrapped(req, res);

    expect(mockGetSession).toHaveBeenCalledWith(req, res, sessionCookieConfig);
    expect((req as NextApiRequest & { session: unknown }).session).toBe(
      mockSession,
    );
    expect(handler).toHaveBeenCalledWith(req, res);
  });
});
