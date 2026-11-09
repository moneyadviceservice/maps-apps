import { NextApiRequest, NextApiResponse } from 'next';

import { IronSession } from 'iron-session';
import {
  AuthenticationResult,
  AuthorizationCodeRequest,
  AuthorizationUrlRequest,
  ConfidentialClientApplication,
  CryptoProvider,
} from '@azure/msal-node';

import { redisRestSet } from '@maps-react/redis/rest-client';

import { destroySession } from '../session/destroySession';
import type { SessionCookieConfig } from '../session/loadSessionContext';
import type { MsalSessionData, NextApiRequestWithSession } from '../types';

/** Session shape during auth code flow (login redirect / handleRedirect). */
type SessionWithAuthFlow = IronSession<MsalSessionData> & {
  authCodeRequest?: Partial<AuthorizationCodeRequest>;
  authCodeUrlRequest?: Partial<AuthorizationUrlRequest>;
  pkceCodes?: {
    verifier?: string;
    challenge?: string;
    challengeMethod?: string;
  };
  tokenCache?: string;
};

export type CreateProviderOptions = {
  getMsalInstance: () => ConfidentialClientApplication;
  redirectUri: string;
  tenantSubdomain: string;
  authority: string;
  sessionCookieConfig: SessionCookieConfig;
  getSession: (
    req: NextApiRequest,
    res: NextApiResponse,
    config: SessionCookieConfig,
  ) => Promise<IronSession<MsalSessionData>>;
  getPostLogoutRedirectUri: (referer?: string) => string;
  getAdminAppRole?: string;
  /** If provided, used to fetch and set authority metadata before login redirect */
  setAuthorityMetadata?: (metadataJson: string) => void;
};

const cryptoProvider = new CryptoProvider();

export function createProvider(options: CreateProviderOptions) {
  const {
    getMsalInstance,
    redirectUri,
    tenantSubdomain,
    authority,
    sessionCookieConfig,
    getSession,
    getPostLogoutRedirectUri: getRedirectUri,
    getAdminAppRole = '',
    setAuthorityMetadata,
  } = options;

  const getAuthorityMetadata = async (): Promise<string> => {
    const endpoint = `${authority}${tenantSubdomain}.onmicrosoft.com/v2.0/.well-known/openid-configuration`;
    const response = await fetch(endpoint);
    const metadata = await response.json();
    return JSON.stringify(metadata);
  };

  const login = async (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    loginOptions: { redirectTo?: string } = {},
  ): Promise<void> => {
    const session = req.session as unknown as Record<string, unknown>;
    session.csrfToken = cryptoProvider.createNewGuid();

    const state = cryptoProvider.base64Encode(
      JSON.stringify({
        csrfToken: session.csrfToken,
        redirectTo: loginOptions.redirectTo ?? '/',
      }),
    );

    const defaultScopes = ['openid', 'profile', 'email', 'offline_access'];
    const authCodeUrlRequestParams = { state, scopes: defaultScopes };
    const authCodeRequestParams = { state, scopes: defaultScopes };

    const msalInstance = getMsalInstance();
    if (setAuthorityMetadata) {
      const metadata = await getAuthorityMetadata();
      setAuthorityMetadata(metadata);
    }

    await redirectToAuthCodeUrl({
      req,
      res,
      authCodeUrlRequestParams,
      authCodeRequestParams,
      msalInstance,
      getSession,
      sessionCookieConfig,
      redirectUri,
    });
  };

  const handleRedirect = async (
    req: NextApiRequest & { body: { code: string; state: string } },
    res: NextApiResponse,
  ): Promise<void> => {
    const msalInstance = getMsalInstance();
    const session = (await getSession(
      req,
      res,
      sessionCookieConfig,
    )) as SessionWithAuthFlow;

    try {
      if (!session.authCodeRequest) {
        console.error('Invalid authCodeRequest');
        throw new Error('Invalid authCodeRequest');
      }

      const authCodeRequest = {
        ...session.authCodeRequest,
        code: req.body.code,
        codeVerifier: session.pkceCodes?.verifier,
      };

      if (session.tokenCache) {
        msalInstance.getTokenCache().deserialize(session.tokenCache);
      }

      const tokenResponse: AuthenticationResult =
        await msalInstance.acquireTokenByCode(
          authCodeRequest as AuthorizationCodeRequest,
          req.body,
        );

      const tokenCache = msalInstance.getTokenCache();
      const serializedCache = tokenCache.serialize();
      const { account, expiresOn } = tokenResponse;
      const sessionKey = cryptoProvider.createNewGuid();

      const preservedKeys = new Set(['cookie', 'save', 'destroy']);
      Object.keys(session).forEach((key) => {
        if (!preservedKeys.has(key))
          delete (session as Record<string, unknown>)[key];
      });

      const adminRole = getAdminAppRole ?? '';
      session.isAuthenticated = !!account?.homeAccountId;
      session.username = account?.username ?? '';
      session.name = account?.name ?? '';
      session.isAdmin =
        account?.idTokenClaims?.roles?.includes(adminRole) ?? false;
      session.expiresOn = expiresOn ?? undefined;
      session.sessionKey = sessionKey;

      await session.save();

      const sessionStore = {
        tokenCache: serializedCache,
        account,
      };

      const ttlSeconds = expiresOn
        ? Math.max(60, Math.floor((expiresOn.getTime() - Date.now()) / 1000))
        : 3600;

      const setResult = await redisRestSet(
        sessionKey,
        JSON.stringify(sessionStore),
        { ttlSeconds },
      );

      if (!setResult.success) {
        console.error('[handleRedirect] Redis set failed:', setResult.error);
        await destroySession(session, sessionKey);
        res.status(500).send('Authentication failed');
        return;
      }

      const state = JSON.parse(cryptoProvider.base64Decode(req.body.state));
      res.redirect(state?.redirectTo ?? '/');
    } catch (error) {
      console.error('Redirect error:', error);
      await destroySession(session, `${session.sessionKey}`);
      res.status(500).send('Authentication failed');
    }
  };

  const logout = async (
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<void> => {
    const session = await getSession(req, res, sessionCookieConfig);

    await destroySession(session, `${session.sessionKey}`);

    const referer =
      req?.headers?.referer ??
      (typeof process === 'undefined' ? undefined : process.env.APP_ROOT);
    const logoutRedirect = getRedirectUri(referer);

    const logoutUri = `${authority}${tenantSubdomain}.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=${logoutRedirect}&client-request-id=${cryptoProvider.createNewGuid()}`;

    res.redirect(logoutUri);
  };

  return { login, handleRedirect, logout };
}

type RedirectToAuthCodeUrlParams = {
  req: NextApiRequestWithSession;
  res: NextApiResponse;
  authCodeUrlRequestParams: Partial<AuthorizationUrlRequest>;
  authCodeRequestParams: Partial<AuthorizationCodeRequest>;
  msalInstance: ConfidentialClientApplication;
  getSession: (
    req: NextApiRequest,
    res: NextApiResponse,
    config: SessionCookieConfig,
  ) => Promise<IronSession<MsalSessionData>>;
  sessionCookieConfig: SessionCookieConfig;
  redirectUri: string;
};

async function redirectToAuthCodeUrl(
  params: RedirectToAuthCodeUrlParams,
): Promise<void> {
  const {
    req,
    res,
    authCodeUrlRequestParams,
    authCodeRequestParams,
    msalInstance,
    getSession,
    sessionCookieConfig,
    redirectUri,
  } = params;
  const session = (await getSession(
    req,
    res,
    sessionCookieConfig,
  )) as SessionWithAuthFlow;

  const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

  session.pkceCodes = {
    challengeMethod: 'S256',
    verifier,
    challenge,
  };

  session.authCodeUrlRequest = {
    ...authCodeUrlRequestParams,
    redirectUri,
    responseMode: 'query',
    codeChallenge: challenge,
    codeChallengeMethod: 'S256',
  } as AuthorizationUrlRequest;

  session.authCodeRequest = {
    ...authCodeRequestParams,
    redirectUri,
    code: '',
  } as AuthorizationCodeRequest;

  await session.save();

  try {
    const authCodeUrl = await msalInstance.getAuthCodeUrl(
      session.authCodeUrlRequest as AuthorizationUrlRequest,
    );
    res.redirect(authCodeUrl);
  } catch (error) {
    console.error('Auth code redirect error:', error);
    res.status(500).send('Failed to initiate login');
  }
}
