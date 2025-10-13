import { IronSession, IronSessionData } from 'iron-session';

import { redisDel } from '@maps-react/redis/helpers';

import { destroySession } from './destroySession';

jest.mock('@maps-react/redis/helpers', () => ({
  redisDel: jest.fn(),
}));

describe('destroySession', () => {
  const mockSession = {
    destroy: jest.fn(),
  } as unknown as IronSession<IronSessionData>;

  it('should call session.destroy(), redisDel() with the correct key, and return true', async () => {
    const sessionKey = 'user-session-abc-123';
    const result = await destroySession(mockSession, sessionKey);

    expect(mockSession.destroy).toHaveBeenCalledTimes(1);
    expect(redisDel).toHaveBeenCalledTimes(1);
    expect(redisDel).toHaveBeenCalledWith(sessionKey);
    expect(result).toBe(true);
  });

  it('should still return true even if sessionKey does not exist in redis', async () => {
    const sessionKey = 'non-existent-key';

    const result = await destroySession(mockSession, sessionKey);

    expect(result).toBe(true);
  });
});
