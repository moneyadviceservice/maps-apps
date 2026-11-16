import { NextApiRequest, NextApiResponse } from 'next';

import { getIronSession } from 'iron-session';

import { withIronSession } from './withIronSession';

jest.mock('iron-session', () => ({
  getIronSession: jest.fn(),
}));

describe('withIronSession', () => {
  it('attaches the session to req and calls the original handler', async () => {
    const mockSession = { user: { id: 123 } };
    const mockSessionOptions = {
      cookieName: 'test',
      password: 'long_password',
    };

    (getIronSession as jest.Mock).mockResolvedValue(mockSession);

    const mockApiHandler = jest.fn().mockResolvedValue('success');

    const req = {} as NextApiRequest;
    const res = {} as NextApiResponse;

    const wrappedHandler = withIronSession(mockApiHandler, mockSessionOptions);

    await wrappedHandler(req, res);

    expect(getIronSession).toHaveBeenCalledWith(req, res, mockSessionOptions);

    expect(req.session).toEqual(mockSession);

    expect(mockApiHandler).toHaveBeenCalledWith(req, res);
  });
});
