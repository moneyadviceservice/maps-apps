import { NextApiRequest } from 'next';

import { IronSession } from 'iron-session';

import * as redisRestClient from '@maps-react/redis/rest-client';

import {
  mockLoginReq,
  mockMsalInstanceForRedirect,
  mockNextApiResponse,
  redirectReqBody,
  sessionForRedirect,
  setupMsalCryptoSpies,
} from '../test-utils/providerTestUtils';
import type { MsalSessionData, NextApiRequestWithSession } from '../types';
import type { CreateProviderOptions } from './createProvider';
import { createProvider } from './createProvider';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestGet: jest.fn(),
  redisRestSet: jest.fn().mockResolvedValue({ success: true }),
  redisRestDel: jest.fn().mockResolvedValue({ success: true }),
}));

setupMsalCryptoSpies();

const redisRestSet = redisRestClient.redisRestSet as jest.Mock;
const redisRestDel = redisRestClient.redisRestDel as jest.Mock;

const mockGetSession = jest.fn();
const mockGetMsalInstance = jest.fn();
const mockGetRedirectUri = jest.fn().mockReturnValue('https://app/logout');

const sessionCookieConfig = {
  password: 'p',
  cookieName: 'c',
  cookieOptions: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
  },
};

const baseOptions: CreateProviderOptions = {
  getMsalInstance: mockGetMsalInstance,
  redirectUri: 'https://app/auth/redirect',
  tenantSubdomain: 't',
  authority: 'https://',
  sessionCookieConfig,
  getSession: mockGetSession,
  getPostLogoutRedirectUri: mockGetRedirectUri,
};

function mockRes() {
  return mockNextApiResponse();
}

describe('createProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest
      .fn()
      .mockResolvedValue({ json: () => Promise.resolve({}) });
  });

  describe('login', () => {
    it('redirects to auth code url', async () => {
      mockGetSession.mockResolvedValue({ save: jest.fn() });
      const mockGetAuthCodeUrl = jest
        .fn()
        .mockResolvedValue('https://login/url');
      mockGetMsalInstance.mockReturnValue({
        getAuthCodeUrl: mockGetAuthCodeUrl,
      });

      const { login } = createProvider(baseOptions);
      const res = mockRes();
      await login(mockLoginReq() as unknown as NextApiRequestWithSession, res, {
        redirectTo: '/dashboard',
      });

      expect(mockGetAuthCodeUrl).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('https://login/url');
    });

    it('calls setAuthorityMetadata and getAuthorityMetadata when provided', async () => {
      const setAuthorityMetadata = jest.fn();
      mockGetSession.mockResolvedValue({ save: jest.fn() });
      mockGetMsalInstance.mockReturnValue({
        getAuthCodeUrl: jest.fn().mockResolvedValue('https://login/url'),
      });

      const { login } = createProvider({
        ...baseOptions,
        setAuthorityMetadata,
      });
      const res = mockRes();
      await login(mockLoginReq() as unknown as NextApiRequestWithSession, res);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://t.onmicrosoft.com/v2.0/.well-known/openid-configuration',
      );
      expect(setAuthorityMetadata).toHaveBeenCalled();
    });

    it('sends 500 when getAuthCodeUrl throws', async () => {
      mockGetSession.mockResolvedValue({ save: jest.fn() });
      mockGetMsalInstance.mockReturnValue({
        getAuthCodeUrl: jest.fn().mockRejectedValue(new Error('auth error')),
      });

      const { login } = createProvider(baseOptions);
      const res = mockRes();
      await login(mockLoginReq() as unknown as NextApiRequestWithSession, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Failed to initiate login');
    });
  });

  describe('handleRedirect', () => {
    it('returns 500 when session has no authCodeRequest', async () => {
      mockGetSession.mockResolvedValue({ sessionKey: 'k', destroy: jest.fn() });
      mockGetMsalInstance.mockReturnValue({});

      const { handleRedirect } = createProvider(baseOptions);
      const req = { body: { code: 'c', state: 's' } } as NextApiRequest & {
        body: { code: string; state: string };
      };
      const res = mockRes();
      await handleRedirect(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Authentication failed');
    });

    it('redirects to state.redirectTo and saves session when token and Redis succeed', async () => {
      const session =
        sessionForRedirect() as unknown as IronSession<MsalSessionData> & {
          authCodeRequest: object;
          pkceCodes: object;
        };
      mockGetSession.mockResolvedValue(session);
      const mockMsal = mockMsalInstanceForRedirect();
      mockGetMsalInstance.mockReturnValue({
        acquireTokenByCode: mockMsal.acquireTokenByCode,
        getTokenCache: () => mockMsal.getTokenCache(),
      });

      const { handleRedirect } = createProvider(baseOptions);
      const req = {
        body: redirectReqBody({ redirectTo: '/secure' }),
      } as NextApiRequest & { body: { code: string; state: string } };
      const res = mockRes();
      await handleRedirect(req, res);

      expect(redisRestSet).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/secure');
    });

    it('redirects to / when state has no redirectTo', async () => {
      const session =
        sessionForRedirect() as unknown as IronSession<MsalSessionData> & {
          authCodeRequest: object;
          pkceCodes: object;
        };
      mockGetSession.mockResolvedValue(session);
      const mockMsal = mockMsalInstanceForRedirect();
      mockGetMsalInstance.mockReturnValue({
        acquireTokenByCode: mockMsal.acquireTokenByCode,
        getTokenCache: () => mockMsal.getTokenCache(),
      });

      const { handleRedirect } = createProvider(baseOptions);
      const req = {
        body: {
          code: 'code',
          state: redirectReqBody({ csrfToken: 'x' }).state,
        },
      } as NextApiRequest & { body: { code: string; state: string } };
      const res = mockRes();
      await handleRedirect(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('deserializes tokenCache when session has tokenCache', async () => {
      const mockDeserialize = jest.fn();
      const session = sessionForRedirect({
        tokenCache: 'cached-token-data',
      }) as unknown as IronSession<MsalSessionData> & {
        authCodeRequest: object;
        pkceCodes: object;
        tokenCache?: string;
      };
      mockGetSession.mockResolvedValue(session);
      const mockMsal = mockMsalInstanceForRedirect({
        deserialize: mockDeserialize,
      });
      mockGetMsalInstance.mockReturnValue({
        acquireTokenByCode: mockMsal.acquireTokenByCode,
        getTokenCache: mockMsal.getTokenCache,
      });

      const { handleRedirect } = createProvider(baseOptions);
      const req = {
        body: redirectReqBody({ redirectTo: '/secure' }),
      } as NextApiRequest & { body: { code: string; state: string } };
      const res = mockRes();
      await handleRedirect(req, res);

      expect(mockDeserialize).toHaveBeenCalledWith('cached-token-data');
      expect(res.redirect).toHaveBeenCalledWith('/secure');
    });

    it('sends 500 when Redis set fails after token', async () => {
      const session = sessionForRedirect({
        destroy: jest.fn(),
      }) as unknown as IronSession<MsalSessionData> & {
        authCodeRequest: object;
        pkceCodes: object;
      };
      mockGetSession.mockResolvedValue(session);
      redisRestSet.mockResolvedValue({
        success: false,
        error: 'Redis error',
      });
      const mockMsal = mockMsalInstanceForRedirect();
      mockGetMsalInstance.mockReturnValue({
        acquireTokenByCode: mockMsal.acquireTokenByCode,
        getTokenCache: mockMsal.getTokenCache,
      });

      const { handleRedirect } = createProvider(baseOptions);
      const req = {
        body: redirectReqBody({ redirectTo: '/' }),
      } as NextApiRequest & { body: { code: string; state: string } };
      const res = mockRes();
      await handleRedirect(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Authentication failed');
    });

    it('sends 500 when acquireTokenByCode throws', async () => {
      mockGetSession.mockResolvedValue(
        sessionForRedirect({
          sessionKey: 'sk',
          destroy: jest.fn(),
        }),
      );
      const mockMsal = mockMsalInstanceForRedirect({
        acquireTokenReject: new Error('Token error'),
      });
      mockGetMsalInstance.mockReturnValue({
        acquireTokenByCode: mockMsal.acquireTokenByCode,
        getTokenCache: () => ({ deserialize: jest.fn() }),
      });

      const { handleRedirect } = createProvider(baseOptions);
      const req = {
        body: redirectReqBody({ redirectTo: '/' }),
      } as NextApiRequest & { body: { code: string; state: string } };
      const res = mockRes();
      await handleRedirect(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Authentication failed');
    });
  });

  describe('logout', () => {
    it('destroys session and redirects to logout uri', async () => {
      mockGetSession.mockResolvedValue({
        sessionKey: 'sk',
        destroy: jest.fn(),
      });

      const { logout } = createProvider(baseOptions);
      const req = { headers: {} } as NextApiRequest;
      const res = mockRes();
      await logout(req, res);

      expect(redisRestDel).toHaveBeenCalledWith('sk');
      expect(mockGetRedirectUri).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('oauth2/v2.0/logout'),
      );
    });

    it('calls getPostLogoutRedirectUri with referer when present', async () => {
      mockGetRedirectUri.mockReturnValue('https://app/admin/');
      mockGetSession.mockResolvedValue({
        sessionKey: 'sk',
        destroy: jest.fn(),
      });

      const { logout } = createProvider(baseOptions);
      const req = {
        headers: { referer: 'https://example.com/admin/page' },
      } as NextApiRequest;
      const res = mockRes();
      await logout(req, res);

      expect(mockGetRedirectUri).toHaveBeenCalledWith(
        'https://example.com/admin/page',
      );
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('post_logout_redirect_uri=https://app/admin/'),
      );
    });
  });
});
