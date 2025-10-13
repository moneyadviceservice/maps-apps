import { IronSession, IronSessionData } from 'iron-session';
import { AccountInfo, ConfidentialClientApplication } from '@azure/msal-node';

import { redisSet } from '@maps-react/redis/helpers';

import { destroySession } from './destroySession';

export async function handleSessionRefresh(
  session: IronSession<IronSessionData>,
  sessionKey: string,
  parsed: { tokenCache: string; account: AccountInfo | null },
  msalInstance: ConfidentialClientApplication,
  account: AccountInfo,
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

    const expiresOn = result.expiresOn;

    if (result.expiresOn) {
      session.expiresOn = result.expiresOn;
      await session.save();
    }

    const updatedCache = msalInstance.getTokenCache().serialize();

    const ttlSeconds = expiresOn
      ? Math.max(60, Math.floor((expiresOn.getTime() - Date.now()) / 1000))
      : 3600;

    await redisSet(
      sessionKey,
      JSON.stringify({ ...parsed, tokenCache: updatedCache }),
      ttlSeconds,
    );

    return true;
  } catch {
    await destroySession(session, sessionKey);

    return false;
  }
}
