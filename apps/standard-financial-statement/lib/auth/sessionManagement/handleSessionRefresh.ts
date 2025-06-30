import { IronSession, IronSessionData } from 'iron-session';
import { AccountInfo, ConfidentialClientApplication } from '@azure/msal-node';
import { Store } from '@netlify/blobs';

import { destroySession } from './destroySession';

export async function handleSessionRefresh(
  session: IronSession<IronSessionData>,
  sessionKey: string,
  parsed: { tokenCache: string; account: AccountInfo | null },
  msalInstance: ConfidentialClientApplication,
  account: AccountInfo,
  store: Store,
): Promise<boolean> {
  const now = new Date();
  const expiry = session.expiresOn ? new Date(session.expiresOn) : null;
  const isExpired = !session.isAuthenticated || !expiry || now > expiry;

  if (!isExpired) return true;

  try {
    const result = await msalInstance.acquireTokenSilent({
      account,
      scopes: [],
    });

    if (!result?.account?.homeAccountId) {
      throw new Error('Unable to refresh token');
    }

    if (result.expiresOn) {
      session.expiresOn = result.expiresOn;
      await session.save();
    }

    const updatedCache = msalInstance.getTokenCache().serialize();
    await store.set(
      sessionKey,
      JSON.stringify({ ...parsed, tokenCache: updatedCache }),
    );

    return true;
  } catch {
    await destroySession(session, sessionKey, store);

    return false;
  }
}
