import { IronSession, IronSessionData } from 'iron-session';
import { AccountInfo, ConfidentialClientApplication } from '@azure/msal-node';
import { Store } from '@netlify/blobs';

import { destroySession } from './destroySession';
import { handleSessionRefresh } from './handleSessionRefresh';

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
  } as unknown as IronSession<IronSessionData>);

const createMockMsalInstance = (overrides = {}) =>
  ({
    acquireTokenSilent: jest.fn(),
    getTokenCache: () => ({
      serialize: jest.fn().mockReturnValue('serialized-cache'),
    }),
    ...overrides,
  } as unknown as ConfidentialClientApplication);

const mockStore: Partial<Store> = {
  set: jest.fn(),
};

const mockAccount = {
  homeAccountId: 'mock-home-account-id',
} as AccountInfo;

describe('handleSessionRefresh', () => {
  const sessionKey = 'session-key';
  const parsed = { tokenCache: 'cached-token', account: mockAccount };

  beforeEach(() => {
    jest.clearAllMocks();
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
      mockStore as Store,
    );

    expect(result).toBe(true);
    expect(msal.acquireTokenSilent).not.toHaveBeenCalled();
  });

  it('refreshes token and updates session if expired', async () => {
    const expiresPast = new Date(Date.now() - 10000).toISOString();
    const session = mockSession({ expiresOn: expiresPast });

    const mockTokenResult = {
      account: mockAccount,
      expiresOn: new Date(Date.now() + 3600000),
    };

    const msal = createMockMsalInstance({
      acquireTokenSilent: jest.fn().mockResolvedValue(mockTokenResult),
    });

    const result = await handleSessionRefresh(
      session,
      sessionKey,
      parsed,
      msal,
      mockAccount,
      mockStore as Store,
    );

    expect(result).toBe(true);
    expect(session.expiresOn).toEqual(mockTokenResult.expiresOn);
    expect(session.save).toHaveBeenCalled();
    expect(mockStore.set).toHaveBeenCalledWith(
      sessionKey,
      JSON.stringify({
        ...parsed,
        tokenCache: 'serialized-cache',
      }),
    );
  });

  it('destroys session and returns false if token refresh fails', async () => {
    const expiresPast = new Date(Date.now() - 10000).toISOString();
    const session = mockSession({ expiresOn: expiresPast });

    const msal = createMockMsalInstance({
      acquireTokenSilent: jest.fn().mockRejectedValue(new Error('Failed')),
    });

    const result = await handleSessionRefresh(
      session,
      sessionKey,
      parsed,
      msal,
      mockAccount,
      mockStore as Store,
    );

    expect(result).toBe(false);
    expect(destroySession).toHaveBeenCalledWith(session, sessionKey, mockStore);
  });

  it('destroys session and returns false if acquireTokenSilent returns no account', async () => {
    const expiresPast = new Date(Date.now() - 10000).toISOString();
    const session = mockSession({ expiresOn: expiresPast });

    const msal = createMockMsalInstance({
      acquireTokenSilent: jest.fn().mockResolvedValue({}),
    });

    const result = await handleSessionRefresh(
      session,
      sessionKey,
      parsed,
      msal,
      mockAccount,
      mockStore as Store,
    );

    expect(result).toBe(false);
    expect(destroySession).toHaveBeenCalled();
  });
});
