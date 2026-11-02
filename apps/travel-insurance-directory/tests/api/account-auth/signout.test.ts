import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import handler from 'pages/api/account-auth/signout';
import { IronSessionObject } from 'types/iron-session';

jest.mock('lib/accountAuth/withAccountSession', () => ({
  withAccountSession: (fn: NextApiHandler) => fn,
}));

function createMockRes(): NextApiResponse {
  const res: Partial<NextApiResponse> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res as NextApiResponse;
}

function createMockReq(
  method = 'GET',
): NextApiRequest & { session: IronSessionObject } {
  return {
    method,
    headers: {},
    session: {
      destroy: jest.fn(),
      save: jest.fn(),
    },
  } as unknown as NextApiRequest;
}

describe('/api/account-auth/signout', () => {
  it('returns 405 for non-GET requests', async () => {
    const req = createMockReq('POST');
    const res = createMockRes();

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'GET');
    expect(res.statusCode).toBe(405);
    expect(res.end).toHaveBeenCalled();
  });

  it('destroys session and redirects to /account/login', async () => {
    const req = createMockReq('GET');
    const res = createMockRes();

    await handler(req, res);

    expect(req.session.destroy).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(302, '/account/login');
  });
});
