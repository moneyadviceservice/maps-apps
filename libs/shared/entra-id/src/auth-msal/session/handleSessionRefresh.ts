import { IronSession } from 'iron-session';
import { AccountInfo, ConfidentialClientApplication } from '@azure/msal-node';

import { redisRestSet } from '@maps-react/redis/rest-client';

import { destroySession } from './destroySession';
import type { MsalSessionData } from '../types';

export async function handleSessionRefresh(
  session: IronSession<MsalSessionData>,
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

    const setResult = await redisRestSet(
      sessionKey,
      JSON.stringify({ ...parsed, tokenCache: updatedCache }),
      { ttlSeconds },
    );

    if (!setResult.success) {
      throw new Error(setResult.error);
    }

    return true;
  } catch {
    await destroySession(session, sessionKey);
    return false;
  }
}
