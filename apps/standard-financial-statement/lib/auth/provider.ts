import { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
import { getIronSession, IronSessionData } from 'iron-session';
import { IronSessionObject } from 'types/iron-session';
import { getPostLogoutRedirectUri } from 'utils/auth/getPostLogoutRedirectUri';
import {
  AuthenticationResult,
  AuthorizationCodeRequest,
  AuthorizationUrlRequest,
  ConfidentialClientApplication,
  CryptoProvider,
} from '@azure/msal-node';

import { redisSet } from '@maps-react/redis/helpers';

import { destroySession } from './sessionManagement/destroySession';
import { msalConfig, REDIRECT_URI, TENANT_SUBDOMAIN } from './config';
import { sessionCookieConfig } from './sessionCookieConfig';

const cryptoProvider = new CryptoProvider();

const getMsalInstance = () => new ConfidentialClientApplication(msalConfig);

const getAuthorityMetadata = async () => {
  const endpoint = `${msalConfig.auth.authority}${TENANT_SUBDOMAIN}.onmicrosoft.com/v2.0/.well-known/openid-configuration`;
  const response = await axios.get(endpoint);
  return response.data;
};

export const login = async (
  req: NextApiRequest,
  res: NextApiResponse,
  options: { redirectTo?: string } = {},
): Promise<void> => {
  req.session.csrfToken = cryptoProvider.createNewGuid();

  const state = cryptoProvider.base64Encode(
    JSON.stringify({
      csrfToken: req.session.csrfToken,
      redirectTo: options.redirectTo ?? '/',
    }),
  );

  const defaultScopes = ['openid', 'profile', 'email', 'offline_access'];

  const authCodeUrlRequestParams = { state, scopes: defaultScopes };
  const authCodeRequestParams = { state, scopes: defaultScopes };

  if (!msalConfig.auth.authorityMetadata) {
    const metadata = await getAuthorityMetadata();
    msalConfig.auth.authorityMetadata = JSON.stringify(metadata);
  }

  const msalInstance = getMsalInstance();
  await redirectToAuthCodeUrl(
    req,
    res,
    authCodeUrlRequestParams,
    authCodeRequestParams,
    msalInstance,
  );
};

export const handleRedirect = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const msalInstance = getMsalInstance();

  const session = await getIronSession<IronSessionObject>(
    req,
    res,
    sessionCookieConfig,
  );

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
      await msalInstance.acquireTokenByCode(authCodeRequest, req.body);

    const tokenCache = msalInstance.getTokenCache();
    const serializedCache = tokenCache.serialize();

    const { account, expiresOn } = tokenResponse;

    const sessionKey = cryptoProvider.createNewGuid();

    // cleanup initial handshake data
    const preservedKeys = ['cookie', 'save'];
    Object.keys(session).forEach((key) => {
      if (!preservedKeys.includes(key)) delete session[key];
    });

    session.isAuthenticated = !!account?.homeAccountId;
    session.username = account?.username ?? '';
    session.name = account?.name ?? '';
    session.isAdmin =
      account?.idTokenClaims?.roles?.includes('sfs_admin') ?? false;
    session.expiresOn = expiresOn;
    session.sessionKey = sessionKey;

    await session.save();

    const sessionStore = {
      tokenCache: serializedCache,
      account,
    };

    const ttlSeconds = expiresOn
      ? Math.max(60, Math.floor((expiresOn.getTime() - Date.now()) / 1000))
      : 3600;

    await redisSet(sessionKey, JSON.stringify(sessionStore), ttlSeconds);

    const state = await JSON.parse(cryptoProvider.base64Decode(req.body.state));

    res.redirect(state?.redirectTo ?? '/');
  } catch (error) {
    console.error('Redirect error:', error);

    destroySession(session, `${session.sessionKey}`);
    res.status(500).send('Authentication failed');
  }
};

export const logout = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const session = await getIronSession<IronSessionData>(
    req,
    res,
    sessionCookieConfig,
  );

  destroySession(session, `${session.sessionKey}`);

  const logoutRedirect = getPostLogoutRedirectUri(
    req?.headers?.referer ?? process.env.APP_ROOT,
  );

  const logoutUri = `${
    msalConfig.auth.authority
  }${TENANT_SUBDOMAIN}.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=${logoutRedirect}&client-request-id=${cryptoProvider.createNewGuid()}`;

  res.redirect(logoutUri);
};

const redirectToAuthCodeUrl = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authCodeUrlRequestParams: Partial<AuthorizationUrlRequest>,
  authCodeRequestParams: Partial<AuthorizationCodeRequest>,
  msalInstance: ConfidentialClientApplication,
): Promise<void> => {
  const session = await getIronSession<IronSessionObject>(
    req,
    res,
    sessionCookieConfig,
  );

  const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

  session.pkceCodes = {
    challengeMethod: 'S256',
    verifier,
    challenge,
  };

  session.authCodeUrlRequest = {
    ...authCodeUrlRequestParams,
    redirectUri: REDIRECT_URI,
    responseMode: 'query',
    codeChallenge: challenge,
    codeChallengeMethod: 'S256',
  } as AuthorizationUrlRequest;

  session.authCodeRequest = {
    ...authCodeRequestParams,
    redirectUri: REDIRECT_URI,
    code: '',
  } as AuthorizationCodeRequest;

  await session.save();

  try {
    const authCodeUrl = await msalInstance.getAuthCodeUrl(
      session.authCodeUrlRequest,
    );

    res.redirect(authCodeUrl);
  } catch (error) {
    console.error('Auth code redirect error:', error);
    res.status(500).send('Failed to initiate login');
  }
};
