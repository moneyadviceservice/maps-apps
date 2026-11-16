import { IronSession } from 'iron-session';
import { AccountInfo, ConfidentialClientApplication } from '@azure/msal-node';

import { destroySession } from './destroySession';
import { handleSessionRefresh } from './handleSessionRefresh';
import { redisRestSet } from '@maps-react/redis/rest-client';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestSet: jest.fn().mockResolvedValue({ success: true }),
}));
jest.mock('./destroySession', () => ({
  destroySession: jest.fn(),
}));

const mockSession = (overrides = {}) =>
  ({
    isAuthenticated: true,
    expiresOn: new Date(Date.now() + 10000).toISOString(),
    save: jest.fn(),
    destroy: jest.fn(),
    ...overrides,
  } as unknown as IronSession<object>);

const createMockMsalInstance = (overrides = {}) =>
  ({
    acquireTokenSilent: jest.fn(),
    getTokenCache: () => ({
      serialize: jest.fn().mockReturnValue('serialized-cache'),
    }),
    ...overrides,
  } as unknown as ConfidentialClientApplication);

const mockAccount = {
  homeAccountId: 'mock-home-account-id',
} as AccountInfo;

function runExpiredSessionScenario(overrides?: {
  acquireTokenResult?: unknown;
  redisRestSetResult?: { success: boolean; error?: string };
}) {
  const now = Date.now();
  jest.spyOn(Date, 'now').mockImplementation(() => now);
  const expiresPast = new Date(Date.now() - 10000).toISOString();
  const session = mockSession({ expiresOn: expiresPast });
  const msal = createMockMsalInstance({
    acquireTokenSilent: jest.fn().mockResolvedValue(
      overrides?.acquireTokenResult ?? {
        account: mockAccount,
        expiresOn: new Date(Date.now() + 3600000),
      },
    ),
  });
  if (overrides?.redisRestSetResult) {
    (redisRestSet as jest.Mock).mockResolvedValue(overrides.redisRestSetResult);
  }
  return { session, msal };
}

describe('handleSessionRefresh', () => {
  const sessionKey = 'session-key';
  const parsed = { tokenCache: 'cached-token', account: mockAccount };

  beforeEach(() => {
    jest.clearAllMocks();
    (redisRestSet as jest.Mock).mockResolvedValue({ success: true });
  });

  it('returns true if session is not expired', async () => {
    const session = mockSession();
    const msal = createMockMsalInstance();

    const result = await handleSessionRefresh(
      session,
      sessionKey,
      parsed,
      msal,
      mockAccount,
    );

    expect(result).toBe(true);
    expect(msal.acquireTokenSilent).not.toHaveBeenCalled();
  });

  it('refreshes token and calls redisRestSet if expired', async () => {
    const { session, msal } = runExpiredSessionScenario();

    const result = await handleSessionRefresh(
      session,
      sessionKey,
      parsed,
      msal,
      mockAccount,
    );

    expect(result).toBe(true);
    expect(redisRestSet).toHaveBeenCalledWith(sessionKey, expect.any(String), {
      ttlSeconds: 3600,
    });
  });

  it('calls destroySession and returns false when redisRestSet fails', async () => {
    const { session, msal } = runExpiredSessionScenario({
      redisRestSetResult: { success: false, error: 'Set failed' },
    });

    const result = await handleSessionRefresh(
      session,
      sessionKey,
      parsed,
      msal,
      mockAccount,
    );

    expect(result).toBe(false);
    expect(destroySession).toHaveBeenCalledWith(session, sessionKey);
  });

  it('calls destroySession and returns false when acquireTokenSilent throws', async () => {
    const { session, msal } = runExpiredSessionScenario();
    (msal.acquireTokenSilent as jest.Mock).mockRejectedValue(
      new Error('Token expired'),
    );

    const result = await handleSessionRefresh(
      session,
      sessionKey,
      parsed,
      msal,
      mockAccount,
    );

    expect(result).toBe(false);
    expect(destroySession).toHaveBeenCalledWith(session, sessionKey);
  });

  it('calls destroySession and returns false when result has no account.homeAccountId', async () => {
    const { session, msal } = runExpiredSessionScenario({
      acquireTokenResult: {
        account: { homeAccountId: null },
        expiresOn: new Date(Date.now() + 3600000),
      },
    });

    const result = await handleSessionRefresh(
      session,
      sessionKey,
      parsed,
      msal,
      mockAccount,
    );

    expect(result).toBe(false);
    expect(destroySession).toHaveBeenCalledWith(session, sessionKey);
  });

  it('uses ttlSeconds 3600 when result.expiresOn is falsy', async () => {
    const { session, msal } = runExpiredSessionScenario({
      acquireTokenResult: { account: mockAccount, expiresOn: undefined },
    });
    (redisRestSet as jest.Mock).mockResolvedValue({ success: true });

    const result = await handleSessionRefresh(
      session,
      sessionKey,
      parsed,
      msal,
      mockAccount,
    );

    expect(result).toBe(true);
    expect(redisRestSet).toHaveBeenCalledWith(sessionKey, expect.any(String), {
      ttlSeconds: 3600,
    });
  });
});
