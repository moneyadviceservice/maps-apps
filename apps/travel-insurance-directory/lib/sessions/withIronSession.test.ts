import { withIronSession } from './withIronSession';
import { getIronSession } from 'iron-session';

jest.mock('iron-session', () => ({
  getIronSession: jest.fn(),
}));

describe('withIronSession', () => {
  it('attaches the session to req and calls the original handler', async () => {
    const mockSession = { user: { id: 123 } };
    const mockSessionOptions: any = {
      cookieName: 'test',
      password: 'long_password',
    };

    (getIronSession as jest.Mock).mockResolvedValue(mockSession);

    const mockApiHandler = jest.fn().mockResolvedValue('success');

    const req = {} as any;
    const res = {} as any;

    const wrappedHandler = withIronSession(mockApiHandler, mockSessionOptions);

    await wrappedHandler(req, res);

    expect(getIronSession).toHaveBeenCalledWith(req, res, mockSessionOptions);

    expect(req.session).toEqual(mockSession);

    expect(mockApiHandler).toHaveBeenCalledWith(req, res);
  });
});
