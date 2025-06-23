import { GetServerSidePropsContext } from 'next';
import { NextApiRequest, NextApiResponse } from 'next/types';

import { getIronSession, IronSession, IronSessionData } from 'iron-session';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { getStore } from '@netlify/blobs';

import { destroySession } from './destroySession';
import { getSession } from './getSession';

jest.mock('@netlify/blobs');
jest.mock('iron-session');
jest.mock('@azure/msal-node');
jest.mock('./destroySession');

const mockGetIronSession = getIronSession as jest.Mock;
const mockConfidentialClientApplication =
  ConfidentialClientApplication as jest.Mock;
const mockDestroySession = destroySession as jest.Mock;

describe('getSession', () => {
  let mockContext: GetServerSidePropsContext;
  let mockSession: IronSession<IronSessionData>;

  let mockMsalInstance: {
    getTokenCache: jest.Mock;
    acquireTokenSilent: jest.Mock;
  };

  const mockStore = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockContext = {
      req: {} as unknown as NextApiRequest,
      res: {} as unknown as NextApiResponse,
      resolvedUrl: '/dashboard',
    } as unknown as GetServerSidePropsContext;

    mockSession = {
      sessionKey: 'test-session-key',
      destroy: jest.fn(),
      save: jest.fn(),
      isAuthenticated: true,
      expiresOn: new Date(Date.now() + 3600 * 1000).toISOString(),
      isAdmin: false,
    } as unknown as IronSession<IronSessionData>;

    const mockTokenCache = {
      deserialize: jest.fn(),
      getAllAccounts: jest
        .fn()
        .mockResolvedValue([{ homeAccountId: 'test-home-account-id' }]),
      serialize: jest.fn().mockReturnValue('serialized-token-cache'),
    };

    mockMsalInstance = {
      getTokenCache: jest.fn().mockReturnValue(mockTokenCache),
      acquireTokenSilent: jest.fn(),
    };

    mockGetIronSession.mockResolvedValue(mockSession);
    mockConfidentialClientApplication.mockReturnValue(mockMsalInstance);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const redirectToLoginObject = (returnTo: string) => ({
    redirect: {
      destination: `/api/auth/signin?redirectTo=${encodeURIComponent(
        returnTo,
      )}`,
      permanent: false,
    },
  });

  it('should redirect to login if no sessionKey is found', async () => {
    mockGetIronSession.mockResolvedValueOnce(
      {} as IronSession<IronSessionData>,
    );
    const result = await getSession(mockContext, false);
    expect(result).toEqual(redirectToLoginObject('/dashboard'));
  });

  it('should redirect to login and destroy session if session blob is not in store', async () => {
    (getStore as jest.Mock).mockReturnValueOnce(mockStore);

    const result = await getSession(mockContext);

    expect(mockStore.get).toHaveBeenCalledWith('test-session-key');

    expect(mockSession.destroy).toHaveBeenCalled();
    expect(result).toEqual(redirectToLoginObject('/dashboard'));
  });

  it('should redirect to login if tokenCache or homeAccountId are missing', async () => {
    (getStore as jest.Mock).mockReturnValueOnce({
      ...mockStore,
      get: () => JSON.stringify({}),
    });

    const result = await getSession(mockContext);
    expect(mockDestroySession).toHaveBeenCalled();
    expect(result).toEqual(redirectToLoginObject('/dashboard'));
  });

  it('should redirect to login if account is not found in token cache', async () => {
    (getStore as jest.Mock).mockReturnValueOnce({
      ...mockStore,
      get: () =>
        JSON.stringify({
          tokenCache: 'test-token-cache',
          account: { homeAccountId: 'different-id' },
        }),
    });
    const result = await getSession(mockContext);
    expect(mockDestroySession).toHaveBeenCalled();
    expect(result).toEqual(redirectToLoginObject('/dashboard'));
  });

  it('should return the session if it is valid and not expired', async () => {
    (getStore as jest.Mock).mockReturnValueOnce({
      ...mockStore,
      get: () =>
        JSON.stringify({
          tokenCache: 'test-token-cache',
          account: { homeAccountId: 'test-home-account-id' },
        }),
    });
    const result = await getSession(mockContext);
    expect(result).toEqual(mockSession);
  });

  it('should refresh the session if it is expired', async () => {
    const expiredSession = {
      ...mockSession,
      expiresOn: new Date(Date.now() - 1000).toISOString(),
    };
    mockGetIronSession.mockResolvedValue(expiredSession);
    const mockSet = jest.fn();

    (getStore as jest.Mock).mockReturnValueOnce({
      ...mockStore,
      get: () =>
        JSON.stringify({
          tokenCache: 'old-cache',
          account: { homeAccountId: 'test-home-account-id' },
        }),
      set: mockSet,
    });

    mockMsalInstance.acquireTokenSilent.mockResolvedValue({
      expiresOn: new Date(Date.now() + 3600 * 1000),
    });

    const result = await getSession(mockContext);

    expect(mockMsalInstance.acquireTokenSilent).toHaveBeenCalled();
    expect(expiredSession.save).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith(
      'test-session-key',
      expect.any(String),
    );
    expect(result).toEqual(expiredSession);
  });

  it('should redirect to login if silent token acquisition fails', async () => {
    const expiredSession = {
      ...mockSession,
      isAuthenticated: false,
    };
    mockGetIronSession.mockResolvedValue(expiredSession);
    (getStore as jest.Mock).mockReturnValueOnce({
      ...mockStore,
      get: () =>
        JSON.stringify({
          tokenCache: 'old-cache',
          account: { homeAccountId: 'test-home-account-id' },
        }),
    });
    mockMsalInstance.acquireTokenSilent.mockRejectedValue(
      new Error('Silent refresh failed'),
    );

    const result = await getSession(mockContext);

    expect(mockDestroySession).toHaveBeenCalled();
    expect(result).toEqual(redirectToLoginObject('/dashboard'));
  });

  describe('Admin Checks', () => {
    beforeEach(() => {
      (getStore as jest.Mock).mockReturnValueOnce({
        ...mockStore,
        get: () =>
          JSON.stringify({
            tokenCache: 'test-token-cache',
            account: { homeAccountId: 'test-home-account-id' },
          }),
      });
    });

    it('should redirect to admin page if admin is required but user is not admin', async () => {
      const requireAdmin = true;
      const result = await getSession(mockContext, requireAdmin);
      expect(result).toEqual({
        redirect: {
          destination: '/admin',
          permanent: false,
        },
      });
    });

    it('should return session if admin is required and user is admin', async () => {
      const adminSession = { ...mockSession, isAdmin: true };
      mockGetIronSession.mockResolvedValue(adminSession);
      const result = await getSession(mockContext, true);
      expect(result).toEqual(adminSession);
    });

    it('should return session if admin is not required and user is not admin', async () => {
      const result = await getSession(mockContext, false);
      expect(result).toEqual(mockSession);
    });
  });
});
