import { GetServerSidePropsContext } from 'next';

import { IronSession } from 'iron-session';

import { loadSessionContext } from './loadSessionContext';
import { redisRestGet } from '@maps-react/redis/rest-client';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestGet: jest.fn(),
}));
jest.mock('./destroySession', () => ({
  destroySession: jest.fn(),
}));

const mockGetSession = jest.fn();

/** Test-only cookie password (min length for iron-session); not used in production. */
const TEST_SESSION_PASSWORD = 'test-session-password-min-32-chars';

const sessionCookieConfig = {
  password: TEST_SESSION_PASSWORD,
  cookieName: 'test-session',
  cookieOptions: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
  },
};

describe('loadSessionContext', () => {
  const mockContext = {
    req: {},
    res: {},
  } as GetServerSidePropsContext;

  const sessionKey = 'test-key';
  const mockSession = {
    sessionKey,
    destroy: jest.fn(),
  } as unknown as IronSession<object>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue(mockSession);
    (redisRestGet as jest.Mock).mockResolvedValue({
      success: true,
      data: { value: JSON.stringify({}) },
    });
  });

  it('returns null if session has no sessionKey', async () => {
    mockGetSession.mockResolvedValue({ destroy: jest.fn() });

    const result = await loadSessionContext(mockContext, {
      getSession: mockGetSession,
      sessionCookieConfig,
    });

    expect(result).toBeNull();
  });

  it('returns null and destroys session when redisRestGet returns no value', async () => {
    (redisRestGet as jest.Mock).mockResolvedValue({ success: false });

    const result = await loadSessionContext(mockContext, {
      getSession: mockGetSession,
      sessionCookieConfig,
    });

    expect(mockSession.destroy).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('returns session context when valid', async () => {
    const parsed = {
      tokenCache: 'cache',
      account: { homeAccountId: '123' },
    };
    (redisRestGet as jest.Mock).mockResolvedValue({
      success: true,
      data: { value: JSON.stringify(parsed) },
    });

    const result = await loadSessionContext(mockContext, {
      getSession: mockGetSession,
      sessionCookieConfig,
    });

    expect(result).toEqual({
      session: mockSession,
      sessionKey,
      parsedSessionStore: parsed,
    });
  });

  it('returns null and calls destroySession on JSON parse failure', async () => {
    const { destroySession } = await import('./destroySession');
    (redisRestGet as jest.Mock).mockResolvedValue({
      success: true,
      data: { value: 'invalid json' },
    });

    const result = await loadSessionContext(mockContext, {
      getSession: mockGetSession,
      sessionCookieConfig,
    });

    expect(result).toBeNull();
    expect(destroySession).toHaveBeenCalledWith(mockSession, sessionKey);
  });
});
