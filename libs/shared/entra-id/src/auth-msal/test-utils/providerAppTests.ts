import type { NextApiRequest, NextApiResponse } from 'next';

import type { NextApiRequestWithSession } from '../types';
import {
  mockLoginReq,
  mockMsalInstanceForRedirect,
  mockNextApiResponse,
  redirectReqBody,
  sessionForRedirect,
} from './providerTestUtils';

export type ProviderHandlers = {
  login: (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    options?: { redirectTo?: string },
  ) => Promise<void>;
  handleRedirect: (
    req: NextApiRequest & { body: { code: string; state: string } },
    res: NextApiResponse,
  ) => Promise<void>;
  logout: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
};

export type RunProviderAppTestsOptions = {
  getHandlers: () => ProviderHandlers;
  getSessionMock: jest.Mock;
  setMsalInstance: (instance: {
    getAuthCodeUrl?: jest.Mock;
    acquireTokenByCode: jest.Mock;
    getTokenCache: jest.Mock | (() => unknown);
  }) => void;
  redisMocks: { set: jest.Mock; del: jest.Mock };
  configForLogout: { authority: string; tenantSubdomain: string };
  hasAdminRole: boolean;
  getPostLogoutRedirectUriMock?: jest.Mock;
  /** Full expected logout redirect URL (includes client-request-id from mocked createNewGuid). */
  getExpectedLogoutRedirect: () => string;
  /**
   * Value returned by mocked CryptoProvider.createNewGuid (used for sessionKey when Redis set fails).
   * Default 'mock-guid'; use 'guid' when using setupMsalCryptoSpies().
   */
  createNewGuidValue?: string;
  /** Optional; apps can use e.g. 'mock-guid' to match state. */
  csrfToken?: string;
};

/**
 * Shared test suite for app auth handlers (login, handleRedirect, logout).
 * Use from TID and SFS provider.test.ts to avoid duplication.
 */
export function runProviderAppTests(options: RunProviderAppTestsOptions): void {
  const {
    getHandlers,
    getSessionMock,
    setMsalInstance,
    redisMocks,
    getExpectedLogoutRedirect,
    hasAdminRole,
    getPostLogoutRedirectUriMock,
    createNewGuidValue = 'mock-guid',
    csrfToken = 'mock-guid',
  } = options;

  beforeEach(() => {
    redisMocks.set.mockResolvedValue({ success: true });
    redisMocks.del.mockResolvedValue({ success: true });
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should initiate login and redirect', async () => {
      const req = mockLoginReq();
      const res = mockNextApiResponse();
      const sessionWithSave = { ...req.session, save: jest.fn() };
      getSessionMock.mockResolvedValue(sessionWithSave);

      const mockGetAuthCodeUrl = jest
        .fn()
        .mockResolvedValue('https://login.microsoftonline.com/auth');
      setMsalInstance({
        getAuthCodeUrl: mockGetAuthCodeUrl,
        acquireTokenByCode: jest.fn(),
        getTokenCache: jest.fn(),
      });

      const { login } = getHandlers();
      await login(req as unknown as NextApiRequestWithSession, res, {
        redirectTo: '/dashboard',
      });

      expect(res.redirect).toHaveBeenCalledWith(
        'https://login.microsoftonline.com/auth',
      );
    });
  });

  describe('handleRedirect', () => {
    it('should handle redirect, acquire token, and redirect to state', async () => {
      const req = mockLoginReq();
      const res = mockNextApiResponse();
      const session = sessionForRedirect({
        authCodeRequest: { redirectUri: 'http://localhost', scopes: [] },
        pkceCodes: { verifier: 'verifier' },
      });
      req.body = redirectReqBody({
        redirectTo: '/secure',
        csrfToken,
      });
      getSessionMock.mockResolvedValue(session);

      const mockMsal = mockMsalInstanceForRedirect({
        account: {
          username: 'user-name',
          name: 'name',
          homeAccountId: 'H-12345',
          idTokenClaims: hasAdminRole ? { roles: ['tid_admin'] } : {},
        },
      });
      setMsalInstance({
        acquireTokenByCode: mockMsal.acquireTokenByCode,
        getTokenCache: mockMsal.getTokenCache,
      });

      const { handleRedirect } = getHandlers();
      await handleRedirect(
        req as NextApiRequest & { body: { code: string; state: string } },
        res,
      );

      expect(redisMocks.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ ttlSeconds: expect.any(Number) }),
      );
      expect(session.isAuthenticated).toBe(true);
      expect(session.username).toBe('user-name');
      if (hasAdminRole) {
        expect(session.isAdmin).toBe(true);
      }
      expect(res.redirect).toHaveBeenCalledWith('/secure');
    });

    it('should return 500 and destroy session when redis set fails', async () => {
      const req = mockLoginReq();
      const res = mockNextApiResponse();
      const session = sessionForRedirect({
        authCodeRequest: { redirectUri: 'http://localhost', scopes: [] },
        pkceCodes: { verifier: 'verifier' },
        sessionKey: 'key',
        destroy: jest.fn(),
      });
      req.body = redirectReqBody({ redirectTo: '/secure', csrfToken });
      getSessionMock.mockResolvedValue(session);
      redisMocks.set.mockResolvedValue({
        success: false,
        error: 'Redis failed',
      });

      const mockMsal = mockMsalInstanceForRedirect({
        account: {
          username: 'u',
          name: 'n',
          homeAccountId: 'H-12345',
          idTokenClaims: {},
        },
      });
      setMsalInstance({
        acquireTokenByCode: mockMsal.acquireTokenByCode,
        getTokenCache: mockMsal.getTokenCache,
      });

      const { handleRedirect } = getHandlers();
      await handleRedirect(
        req as NextApiRequest & { body: { code: string; state: string } },
        res,
      );

      expect(redisMocks.del).toHaveBeenCalledWith(createNewGuidValue);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Authentication failed');
    });

    it('should return 500 on auth error', async () => {
      const req = mockLoginReq();
      const res = mockNextApiResponse();
      const session = sessionForRedirect({
        authCodeRequest: { redirectUri: 'http://localhost' },
        pkceCodes: { verifier: 'verifier' },
        destroy: jest.fn(),
      });
      req.body = redirectReqBody({ redirectTo: '/secure', csrfToken: 'x' });
      getSessionMock.mockResolvedValue(session);

      const mockMsal = mockMsalInstanceForRedirect({
        acquireTokenReject: new Error('oops'),
      });
      setMsalInstance({
        acquireTokenByCode: mockMsal.acquireTokenByCode,
        getTokenCache: jest.fn().mockReturnValue({ deserialize: jest.fn() }),
      });

      const { handleRedirect } = getHandlers();
      await handleRedirect(
        req as NextApiRequest & { body: { code: string; state: string } },
        res,
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Authentication failed');
    });

    it('should destroy session when authCodeRequest does not exist in session', async () => {
      const req = mockLoginReq();
      const res = mockNextApiResponse();
      const session = {
        sessionKey: undefined,
        destroy: jest.fn(),
      };
      getSessionMock.mockResolvedValue(session);

      const { handleRedirect } = getHandlers();
      await handleRedirect(
        req as NextApiRequest & { body: { code: string; state: string } },
        res,
      );

      expect(redisMocks.del).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should destroy session and redirect', async () => {
      if (getPostLogoutRedirectUriMock) {
        getPostLogoutRedirectUriMock.mockReturnValue('http://localhost:3000/');
      }

      const req = mockLoginReq();
      const res = mockNextApiResponse();
      const session = sessionForRedirect({
        sessionKey: 'sk',
        destroy: jest.fn(),
      });
      getSessionMock.mockResolvedValue(session);

      const { logout } = getHandlers();
      await logout(req as NextApiRequest, res);

      expect(redisMocks.del).toHaveBeenCalledWith('sk');
      expect(res.redirect).toHaveBeenCalledWith(getExpectedLogoutRedirect());
    });
  });
}
