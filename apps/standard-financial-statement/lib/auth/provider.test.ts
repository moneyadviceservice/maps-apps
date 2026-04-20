import { getIronSession } from 'iron-session';
import { ConfidentialClientApplication } from '@azure/msal-node';

import { runProviderAppTests } from '@maps-react/entra-id/auth-msal/test-utils/providerAppTests';
import { setupMsalCryptoSpies } from '@maps-react/entra-id/auth-msal/test-utils/providerTestUtils';
import {
  redisRestDel,
  redisRestGet,
  redisRestSet,
} from '@maps-react/redis/rest-client';

import { msalConfig } from './config';
import { handleRedirect, login, logout } from './provider';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestGet: jest.fn(),
  redisRestSet: jest.fn(),
  redisRestDel: jest.fn(),
}));
jest.mock('@maps-react/entra-id/auth-msal', () => {
  const actual = jest.requireActual('@maps-react/entra-id/auth-msal');
  return {
    ...actual,
    getPostLogoutRedirectUri: jest.fn(),
  };
});
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

setupMsalCryptoSpies();

jest.mock('iron-session');
jest.mock('@azure/msal-node');

beforeAll(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({}),
  });
});

beforeEach(() => {
  (redisRestGet as jest.Mock).mockResolvedValue({
    success: true,
    data: {
      value: JSON.stringify({
        tokenCache: 'test-token-cache',
        account: { homeAccountId: 'test-home-account-id' },
      }),
    },
  });
});

runProviderAppTests({
  getHandlers: () => ({ login, handleRedirect, logout }),
  getSessionMock: getIronSession as jest.Mock,
  setMsalInstance: (inst) =>
    (ConfidentialClientApplication as jest.Mock).mockImplementation(() => inst),
  redisMocks: {
    set: redisRestSet as jest.Mock,
    del: redisRestDel as jest.Mock,
  },
  configForLogout: {
    authority: msalConfig.auth.authority ?? '',
    tenantSubdomain: 'your-tenant',
  },
  hasAdminRole: false,
  getExpectedLogoutRedirect: () =>
    `${msalConfig.auth.authority}your-tenant.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=/&client-request-id=guid`,
  createNewGuidValue: 'guid',
  csrfToken: 'mock-guid',
});
