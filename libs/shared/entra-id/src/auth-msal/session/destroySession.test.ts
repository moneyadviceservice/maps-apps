import { IronSession } from 'iron-session';

import { redisRestDel } from '@maps-react/redis/rest-client';

import { destroySession } from './destroySession';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestDel: jest.fn(),
}));

describe('destroySession', () => {
  const mockSession = {
    destroy: jest.fn(),
  } as unknown as IronSession<object>;

  const sessionKey = 'session-key-123';

  beforeEach(() => {
    jest.clearAllMocks();
    (redisRestDel as jest.Mock).mockResolvedValue({ success: true });
  });

  it('calls session.destroy() and redisRestDel() with sessionKey', async () => {
    const result = await destroySession(mockSession, sessionKey);

    expect(mockSession.destroy).toHaveBeenCalledTimes(1);
    expect(redisRestDel).toHaveBeenCalledWith(sessionKey);
    expect(result).toBe(true);
  });

  it('returns true and logs when redisRestDel fails', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn());
    (redisRestDel as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Redis error',
    });

    const result = await destroySession(mockSession, 'key');

    expect(result).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[destroySession] Redis del failed:',
      'Redis error',
    );
    consoleSpy.mockRestore();
  });
});
