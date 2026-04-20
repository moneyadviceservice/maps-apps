import { NextApiRequest, NextApiResponse } from 'next';

import { getPostLogoutRedirectUri } from '@maps-react/entra-id/auth-msal';
import { runProviderAppTests } from '@maps-react/entra-id/auth-msal/test-utils/providerAppTests';
import { redisRestDel, redisRestSet } from '@maps-react/redis/rest-client';

import { msalConfig } from './config';
import { handleRedirect, login, logout } from './provider';

const mockGetIronSession = jest.fn();

jest.mock('iron-session', () => ({
  getIronSession: (...args: unknown[]) => mockGetIronSession(...args),
}));

jest.mock('@azure/msal-node', () => {
  const mockGeneratePkceCodes = jest.fn().mockResolvedValue({
    verifier: 'mock-verifier',
    challenge: 'mock-challenge',
  });
  const mockCreateNewGuid = jest.fn().mockReturnValue('mock-guid');
  const mockBase64Encode = jest
    .fn()
    .mockImplementation((val: string) => Buffer.from(val).toString('base64'));
  const mockBase64Decode = jest
    .fn()
    .mockImplementation((val: string) =>
      Buffer.from(val, 'base64').toString('utf8'),
    );
  return {
    ConfidentialClientApplication: jest.fn(),
    CryptoProvider: jest.fn().mockImplementation(() => ({
      generatePkceCodes: mockGeneratePkceCodes,
      createNewGuid: mockCreateNewGuid,
      base64Encode: mockBase64Encode,
      base64Decode: mockBase64Decode,
    })),
  };
});

jest.mock('@maps-react/redis/rest-client', () => ({
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
  ADMIN_APP_ROLE: 'tid_admin',
  REDIRECT_URI: 'http://localhost:3000',
  TENANT_SUBDOMAIN: 'your-tenant',
}));

const MockConfidentialClientApplication = jest.requireMock('@azure/msal-node')
  .ConfidentialClientApplication as jest.Mock;

runProviderAppTests({
  getHandlers: () => ({ login, handleRedirect, logout }),
  getSessionMock: mockGetIronSession,
  setMsalInstance: (inst) =>
    MockConfidentialClientApplication.mockImplementation(() => inst),
  redisMocks: {
    set: redisRestSet as jest.Mock,
    del: redisRestDel as jest.Mock,
  },
  configForLogout: {
    authority: msalConfig.auth.authority ?? '',
    tenantSubdomain: 'your-tenant',
  },
  hasAdminRole: true,
  getPostLogoutRedirectUriMock: getPostLogoutRedirectUri as jest.Mock,
  getExpectedLogoutRedirect: () =>
    `${msalConfig.auth.authority}your-tenant.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=/&client-request-id=mock-guid`,
  csrfToken: 'mock-guid',
});

describe('logout (TID-specific)', () => {
  beforeEach(() => {
    (redisRestSet as jest.Mock).mockResolvedValue({ success: true });
    (redisRestDel as jest.Mock).mockResolvedValue({ success: true });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ json: () => Promise.resolve({}) });
  });

  it('calls getPostLogoutRedirectUri with referer when present', async () => {
    mockGetIronSession.mockResolvedValue({
      sessionKey: 'sk',
      destroy: jest.fn(),
    });

    const req = {
      headers: { referer: 'https://example.com/admin/page' },
    } as NextApiRequest;
    const res = {} as NextApiResponse;
    res.redirect = jest.fn();
    res.status = jest.fn(() => res);
    res.send = jest.fn();

    await logout(req, res);

    // createAppProvider uses the package's getPostLogoutRedirectUri; with
    // referer https://example.com/admin/page it returns https://example.com/admin/
    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining(
        'post_logout_redirect_uri=https://example.com/admin/',
      ),
    );
  });
});
