import { GetServerSidePropsContext } from 'next';

import { getIronSession, IronSession, IronSessionData } from 'iron-session';
import { AccountInfo } from '@azure/msal-node';
import { getStore } from '@netlify/blobs';

import { sessionCookieConfig } from '../sessionCookieConfig';
import { destroySession } from './destroySession';

type SessionContextResult = {
  session: IronSession<IronSessionData>;
  sessionKey: string;
  parsedSessionStore: { tokenCache: string; account: AccountInfo | null };
} | null;

export async function loadSessionContext(
  context: GetServerSidePropsContext,
): Promise<SessionContextResult> {
  const session = await getIronSession<IronSessionData>(
    context.req,
    context.res,
    sessionCookieConfig,
  );

  const sessionKey = session.sessionKey;
  if (!sessionKey) return null;

  const store = getStore('user-sessions');

  const sessionBlob = await store.get(sessionKey);
  if (!sessionBlob) {
    session.destroy();

    return null;
  }

  try {
    const parsedSessionStore = JSON.parse(sessionBlob);

    return { session, sessionKey, parsedSessionStore };
  } catch {
    await destroySession(session, sessionKey, store);

    return null;
  }
}
