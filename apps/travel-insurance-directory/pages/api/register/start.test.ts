jest.mock('lib/accountAuth/withAccountSession', () => ({
  withAccountSession: (fn: unknown) => fn,
}));

import type { NextApiRequest, NextApiResponse } from 'next';

import handler from './start';

import type { IronSessionObject } from 'types/iron-session';

function createMockRes(): NextApiResponse {
  const res: Partial<NextApiResponse> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res as NextApiResponse;
}

describe('/api/register/start', () => {
  it('clears registration session and redirects to FCA step', async () => {
    const save = jest.fn().mockResolvedValue(undefined);
    const req = {
      method: 'POST',
      session: {
        fcaData: { frnNumber: '123456', firmName: 'Example Ltd' },
        userData: { mail: 'user@example.com' },
        db_id: 'firm-abc',
        isAccountAuthenticated: true,
        accountEmail: 'user@example.com',
        save,
      } as unknown as IronSessionObject,
    } as NextApiRequest & { session: IronSessionObject };
    const res = createMockRes();

    await handler(req, res);

    expect(req.session.fcaData).toBeUndefined();
    expect(req.session.userData).toBeUndefined();
    expect(req.session.db_id).toBeUndefined();
    expect(req.session.isAccountAuthenticated).toBeUndefined();
    expect(req.session.accountEmail).toBeUndefined();
    expect(save).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(302, '/register/fca');
  });

  it('returns 405 for non-POST requests', async () => {
    const req = {
      method: 'GET',
      session: { save: jest.fn() },
    } as unknown as NextApiRequest & { session: IronSessionObject };
    const res = createMockRes();

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
    expect(res.status).toHaveBeenCalledWith(405);
  });
});
