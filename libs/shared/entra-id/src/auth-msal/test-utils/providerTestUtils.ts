import type { NextApiRequest, NextApiResponse } from 'next';

import * as msalNode from '@azure/msal-node';

/**
 * Returns a mock NextApiResponse with redirect, status (chainable), and send.
 */
export function mockNextApiResponse(): NextApiResponse {
  const res = {} as NextApiResponse;
  res.redirect = jest.fn();
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn();
  return res;
}

/**
 * Returns a request-like object with session and body for provider tests.
 */
export function mockLoginReq(
  overrides: Partial<
    NextApiRequest & { session: Record<string, unknown> }
  > = {},
): NextApiRequest & { session: Record<string, unknown> } {
  return { session: {}, body: {}, ...overrides } as NextApiRequest & {
    session: Record<string, unknown>;
  };
}

export type SessionForRedirectOverrides = {
  authCodeRequest?: { redirectUri: string; scopes?: string[] };
  pkceCodes?: { verifier: string };
  save?: jest.Mock;
  destroy?: jest.Mock;
  sessionKey?: string;
  tokenCache?: string;
};

/**
 * Returns a session object for handleRedirect tests.
 */
export function sessionForRedirect(
  overrides: SessionForRedirectOverrides = {},
): Record<string, unknown> {
  return {
    authCodeRequest: { redirectUri: 'https://app', scopes: [] },
    pkceCodes: { verifier: 'v' },
    save: jest.fn(),
    ...overrides,
  };
}

/**
 * Returns { code, state } for handleRedirect req.body with state = base64(JSON.stringify({ csrfToken, redirectTo })).
 * When options.redirectTo is omitted, redirectTo is not included in the JSON (decoded state.redirectTo will be undefined).
 */
export function redirectReqBody(options?: {
  redirectTo?: string;
  csrfToken?: string;
}): { code: string; state: string } {
  const redirectTo = options?.redirectTo;
  const csrfToken = options?.csrfToken ?? 'x';
  const stateObj =
    redirectTo === undefined ? { csrfToken } : { csrfToken, redirectTo };
  return {
    code: 'code',
    state: Buffer.from(JSON.stringify(stateObj)).toString('base64'),
  };
}

export type MockMsalInstanceForRedirectOptions = {
  acquireTokenReject?: Error;
  account?: {
    homeAccountId?: string;
    username?: string;
    name?: string;
    idTokenClaims?: { roles?: string[] };
  };
  deserialize?: jest.Mock;
};

/**
 * Returns a mock MSAL instance for handleRedirect: acquireTokenByCode and getTokenCache (deserialize, serialize).
 */
export function mockMsalInstanceForRedirect(
  options: MockMsalInstanceForRedirectOptions = {},
): {
  acquireTokenByCode: jest.Mock;
  getTokenCache: jest.Mock;
} {
  const {
    acquireTokenReject,
    account = {
      homeAccountId: 'h',
      username: 'u',
      name: 'n',
      idTokenClaims: { roles: [] },
    },
    deserialize = jest.fn(),
  } = options;

  const serialize = jest.fn().mockReturnValue('serialized');
  const mockTokenCache = { deserialize, serialize };

  const acquireTokenByCode = acquireTokenReject
    ? jest.fn().mockRejectedValue(acquireTokenReject)
    : jest.fn().mockResolvedValue({
        account,
        expiresOn: new Date(Date.now() + 3600000),
      });

  const getTokenCache = jest.fn().mockReturnValue(mockTokenCache);

  return { acquireTokenByCode, getTokenCache };
}

/**
 * Sets up jest.spyOn for CryptoProvider createNewGuid, generatePkceCodes, base64Encode, base64Decode.
 * Call once at top level in tests that use createProvider (lib and SFS).
 */
export function setupMsalCryptoSpies(): void {
  jest
    .spyOn(msalNode.CryptoProvider.prototype, 'createNewGuid')
    .mockReturnValue('guid');
  jest
    .spyOn(msalNode.CryptoProvider.prototype, 'generatePkceCodes')
    .mockResolvedValue({
      verifier: 'v',
      challenge: 'c',
      challengeMethod: 'S256',
    } as Awaited<ReturnType<typeof msalNode.CryptoProvider.prototype.generatePkceCodes>>);
  jest
    .spyOn(msalNode.CryptoProvider.prototype, 'base64Encode')
    .mockImplementation((s: string) => Buffer.from(s).toString('base64'));
  jest
    .spyOn(msalNode.CryptoProvider.prototype, 'base64Decode')
    .mockImplementation((s: string) =>
      Buffer.from(s, 'base64').toString('utf8'),
    );
}
