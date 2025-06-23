import { GetServerSidePropsContext } from 'next';

import { getIronSession, IronSession, IronSessionData } from 'iron-session';
import { RedirectOrSession } from 'lib/types';
import {
  AccountInfo,
  ConfidentialClientApplication,
  TokenCache,
} from '@azure/msal-node';
import { getStore, Store } from '@netlify/blobs';

import { msalConfig } from './config';
import { destroySession } from './destroySession';
import { sessionOptions } from './sessionOptions';

const getMsalInstance = () => new ConfidentialClientApplication(msalConfig);

export const getSession = async (
  context: GetServerSidePropsContext,
  requireAdmin = false,
): Promise<RedirectOrSession> => {
  const store = getStore('user-sessions');

  const msalInstance = getMsalInstance();
  const session = await getIronSession<IronSessionData>(
    context.req,
    context.res,
    sessionOptions,
  );

  const sessionKey = session.sessionKey;
  if (!sessionKey) {
    return redirectToLogin(context);
  }

  const sessionBlob = await store.get(sessionKey);
  if (!sessionBlob) {
    session.destroy();

    return redirectToLogin(context);
  }

  const parsed = JSON.parse(sessionBlob);
  const tokenCache = parsed.tokenCache;
  const homeAccountId = parsed.account?.homeAccountId;

  if (!tokenCache || !homeAccountId) {
    await destroySession(session, sessionKey, store);

    return redirectToLogin(context);
  }

  msalInstance.getTokenCache().deserialize(tokenCache);

  const accounts = await msalInstance.getTokenCache().getAllAccounts();
  const account = accounts.find((acc) => acc.homeAccountId === homeAccountId);

  if (!account) {
    await destroySession(session, sessionKey, store);

    return redirectToLogin(context);
  }

  const now = new Date();
  const expiry = session.expiresOn ? new Date(session.expiresOn) : null;
  const isExpired = !session.isAuthenticated || !expiry || now > expiry;

  if (isExpired) {
    try {
      await refreshSession(
        msalInstance,
        account,
        session,
        sessionKey,
        parsed,
        store,
      );
    } catch {
      await destroySession(session, sessionKey, store);

      return redirectToLogin(context);
    }
  }

  if (requireAdmin && !session.isAdmin) {
    return {
      redirect: {
        destination: `/admin`,
        permanent: false,
      },
    };
  }

  return session;
};

function redirectToLogin(
  context: GetServerSidePropsContext,
): RedirectOrSession {
  const returnTo = context.resolvedUrl ?? '/';
  return {
    redirect: {
      destination: `/api/auth/signin?redirectTo=${encodeURIComponent(
        returnTo,
      )}`,
      permanent: false,
    },
  };
}

async function refreshSession(
  msalInstance: ConfidentialClientApplication,
  account: AccountInfo,
  session: IronSession<IronSessionData>,
  sessionKey: string,
  parsed: TokenCache,
  store: Store,
) {
  const result = await msalInstance.acquireTokenSilent({
    account,
    scopes: [],
  });

  if (result.expiresOn) {
    session.expiresOn = result.expiresOn;
  }
  await session.save();

  const updatedCache = msalInstance.getTokenCache().serialize();
  await store.set(
    sessionKey,
    JSON.stringify({
      ...parsed,
      tokenCache: updatedCache,
    }),
  );
}
