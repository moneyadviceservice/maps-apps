import type { NextApiRequest, NextApiResponse } from 'next';

import { getIronSession } from 'iron-session';
import type { IronSessionObject } from 'types/iron-session';

import { withSession } from './withSession';

jest.mock('iron-session', () => ({
  getIronSession: jest.fn(),
}));

describe('withSession', () => {
  const mockSession = { isAuthenticated: true } as IronSessionObject;

  const req = {} as NextApiRequest;
  const res = {} as NextApiResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    (getIronSession as jest.Mock).mockResolvedValue(mockSession);
  });

  it('should attach session to req and call handler', async () => {
    const handler = jest.fn().mockResolvedValue('handler-response');

    const wrapped = withSession(handler);
    const result = await wrapped(req, res);

    expect(getIronSession).toHaveBeenCalledWith(req, res, expect.any(Object));
    expect(req.session).toBe(mockSession);
    expect(handler).toHaveBeenCalledWith(req, res);
    expect(result).toBe('handler-response');
  });
});
