import { GetServerSidePropsContext } from 'next';

import { getIronSession } from 'iron-session';

import { redisGet } from '@maps-react/redis/helpers';

import { destroySession } from './destroySession';
import { loadSessionContext } from './loadSessionContext';

jest.mock('iron-session', () => ({
  getIronSession: jest.fn(),
}));

jest.mock('@maps-react/redis/helpers', () => ({
  redisGet: jest.fn(),
}));

jest.mock('./destroySession', () => ({
  destroySession: jest.fn(),
}));

describe('loadSessionContext', () => {
  const mockContext = {
    req: {},
    res: {},
  } as GetServerSidePropsContext;

  const sessionKey = 'test-key';

  const mockSession = {
    sessionKey,
    destroy: jest.fn(),
  };

  const mockRedisGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (getIronSession as jest.Mock).mockResolvedValue(mockSession);
    (redisGet as jest.Mock).mockReturnValue(mockRedisGet);
  });

  it('returns null if sessionKey is missing', async () => {
    (getIronSession as jest.Mock).mockResolvedValue({ destroy: jest.fn() });

    const result = await loadSessionContext(mockContext);
    expect(result).toBeNull();
  });

  it('returns null and destroys session if redisGet returns null', async () => {
    (redisGet as jest.Mock).mockResolvedValue(null);

    const result = await loadSessionContext(mockContext);
    expect(redisGet).toHaveBeenCalledWith(sessionKey);
    expect(mockSession.destroy).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('returns null and destroys session on JSON parse failure', async () => {
    mockRedisGet.mockResolvedValue('invalid json');

    const result = await loadSessionContext(mockContext);
    expect(destroySession).toHaveBeenCalledWith(mockSession, sessionKey);
    expect(result).toBeNull();
  });

  it('returns session context when everything is valid', async () => {
    const parsedSessionStore = {
      tokenCache: 'abc',
      account: { homeAccountId: '123' },
    };

    (redisGet as jest.Mock).mockResolvedValue(
      JSON.stringify(parsedSessionStore),
    );

    const result = await loadSessionContext(mockContext);

    expect(result).toEqual({
      session: mockSession,
      sessionKey,
      parsedSessionStore,
    });
  });
});
