import { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
import { getIronSession } from 'iron-session';
import { getPostLogoutRedirectUri } from 'utils/auth/getPostLogoutRedirectUri';
import { ConfidentialClientApplication } from '@azure/msal-node';
import * as msalNode from '@azure/msal-node';

import { redisGet, redisSet } from '@maps-react/redis/helpers';

import { IronSessionObject } from '../../types/iron-session';
import { destroySession } from './sessionManagement/destroySession';
import { msalConfig } from './config';
import { handleRedirect, login, logout } from './provider';

jest.mock('@maps-react/redis/helpers', () => ({
  redisGet: jest.fn(),
  redisSet: jest.fn(),
}));
jest.mock('./sessionManagement/destroySession');
jest.mock('./config', () => ({
  msalConfig: {
    auth: {
      authority: 'https://login.microsoftonline.com/',
      clientId: 'mock-client-id',
      clientSecret: 'mock-secret',
    },
  },
  REDIRECT_URI: 'http://localhost:3000',
  POST_LOGOUT_REDIRECT_URI: 'http://localhost:3000',
  TENANT_SUBDOMAIN: 'your-tenant',
}));

jest
  .spyOn(msalNode.CryptoProvider.prototype, 'generatePkceCodes')
  .mockResolvedValue({
    verifier: 'mock-verifier',
    challenge: 'mock-challenge',
  });
jest
  .spyOn(msalNode.CryptoProvider.prototype, 'createNewGuid')
  .mockReturnValue('mock-guid');
jest
  .spyOn(msalNode.CryptoProvider.prototype, 'base64Encode')
  .mockImplementation((val) => Buffer.from(val).toString('base64'));
jest
  .spyOn(msalNode.CryptoProvider.prototype, 'base64Decode')
  .mockImplementation((val) => Buffer.from(val, 'base64').toString('utf8'));

jest.mock('iron-session');
jest.mock('axios');
jest.mock('@azure/msal-node');
jest.mock('utils/auth/getPostLogoutRedirectUri');

const mockDestroySession = destroySession as jest.Mock;

const mockReq = () =>
  ({
    session: { save: jest.fn() },
    body: {},
  } as unknown as NextApiRequest);

const mockRes = () => {
  const res = {} as NextApiResponse;
  res.redirect = jest.fn();
  res.status = jest.fn(() => res);
  res.send = jest.fn();
  return res;
};

describe('auth handlers', () => {
  beforeEach(() => {
    (redisGet as jest.Mock).mockReturnValue(
      JSON.stringify({
        tokenCache: 'test-token-cache',
        account: { homeAccountId: 'test-home-account-id' },
      }),
    );
    (redisSet as jest.Mock).mockReturnValue(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should initiate login and redirect', async () => {
      const req = mockReq();
      const res = mockRes();

      (getIronSession as jest.Mock).mockResolvedValue(req.session);

      const mockMsalInstance = {
        getAuthCodeUrl: jest
          .fn()
          .mockResolvedValue('https://login.microsoftonline.com/auth'),
      };
      (ConfidentialClientApplication as jest.Mock).mockImplementation(
        () => mockMsalInstance,
      );

      (axios.get as jest.Mock).mockResolvedValue({ data: {} });

      await login(req, res, { redirectTo: '/dashboard' });

      expect(res.redirect).toHaveBeenCalledWith(
        'https://login.microsoftonline.com/auth',
      );
    });
  });

  describe('handleRedirect', () => {
    it('should handle redirect, acquire token, and redirect to state', async () => {
      const req = mockReq();
      const res = mockRes();

      const session = {
        authCodeRequest: {
          redirectUri: 'http://localhost',
          scopes: [],
        },
        pkceCodes: { verifier: 'verifier' },
        save: jest.fn(),
      } as IronSessionObject;

      req.body = {
        code: 'auth-code',
        state: Buffer.from(
          JSON.stringify({ csrfToken: 'mock-guid', redirectTo: '/secure' }),
        ).toString('base64'),
      };

      (getIronSession as jest.Mock).mockResolvedValue(session);

      const mockTokenCache = {
        deserialize: jest.fn(),
        serialize: jest.fn().mockReturnValue('serialized-token-cache'),
      };

      const mockMsalInstance = {
        acquireTokenByCode: jest.fn().mockResolvedValue({
          account: {
            username: 'user-name',
            name: 'name',
            homeAccountId: 'H-12345',
          },
          idTokenClaims: {},
        }),
        getTokenCache: jest.fn().mockReturnValue(mockTokenCache),
      };

      (ConfidentialClientApplication as jest.Mock).mockImplementation(
        () => mockMsalInstance,
      );

      await handleRedirect(req, res);

      expect(redisSet).toHaveBeenCalled();
      expect(session.isAuthenticated).toBe(true);
      expect(session.username).toBe('user-name');
      expect(res.redirect).toHaveBeenCalledWith('/secure');
    });

    it('should return 500 on auth error', async () => {
      const req = mockReq();
      const res = mockRes();

      const session = {
        authCodeRequest: { redirectUri: 'http://localhost' },
        pkceCodes: { verifier: 'verifier' },
        destroy: jest.fn(),
      };

      req.body = {
        code: 'invalid',
        state: Buffer.from(
          JSON.stringify({ csrfToken: 'x', redirectTo: '/secure' }),
        ).toString('base64'),
      };

      (getIronSession as jest.Mock).mockResolvedValue(session);

      const mockMsalInstance = {
        acquireTokenByCode: jest.fn().mockRejectedValue(new Error('oops')),
        getTokenCache: jest.fn().mockReturnValue({ deserialize: jest.fn() }),
      };

      (ConfidentialClientApplication as jest.Mock).mockImplementation(
        () => mockMsalInstance,
      );

      await handleRedirect(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Authentication failed');
    });

    it('should throw error and destroy session data if authCodeRequest does not exist in session', async () => {
      const req = mockReq();
      const res = mockRes();

      const session = {
        destroy: jest.fn(),
      };

      (getIronSession as jest.Mock).mockResolvedValue(session);

      await handleRedirect(req, res);

      expect(mockDestroySession).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should destroy session and redirect', async () => {
      const req = mockReq();
      const res = mockRes();

      const session = {
        destroy: jest.fn(),
      };

      (getIronSession as jest.Mock).mockResolvedValue(session);
      (getPostLogoutRedirectUri as jest.Mock).mockReturnValue(
        'http://localhost:3000/',
      );

      await logout(req, res);

      expect(mockDestroySession).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(
        `${msalConfig.auth.authority}your-tenant.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000/&client-request-id=mock-guid`,
      );
    });
  });
});
