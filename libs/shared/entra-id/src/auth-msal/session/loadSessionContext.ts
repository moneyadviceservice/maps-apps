import { GetServerSidePropsContext } from 'next';

import { IronSession } from 'iron-session';
import { AccountInfo } from '@azure/msal-node';

import { redisRestGet } from '@maps-react/redis/rest-client';

import { destroySession } from './destroySession';
import type { MsalSessionData } from '../types';

export type SessionCookieConfig = {
  password: string;
  cookieName: string;
  cookieOptions: {
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    path: string;
  };
};

export type SessionContextResult = {
  session: IronSession<MsalSessionData>;
  sessionKey: string;
  parsedSessionStore: { tokenCache: string; account: AccountInfo | null };
} | null;

export type GetSessionFn = (
  req: unknown,
  res: unknown,
  config: SessionCookieConfig,
) => Promise<IronSession<MsalSessionData>>;

export async function loadSessionContext(
  context: GetServerSidePropsContext,
  options: {
    getSession: GetSessionFn;
    sessionCookieConfig: SessionCookieConfig;
  },
): Promise<SessionContextResult> {
  const { getSession, sessionCookieConfig } = options;

  const session = await getSession(
    context.req,
    context.res,
    sessionCookieConfig,
  );

  const sessionKey = session.sessionKey;
  if (!sessionKey) return null;

  const result = await redisRestGet(sessionKey);
  const value =
    result.success && result.data?.value != null ? result.data.value : null;

  if (value == null) {
    session.destroy();
    return null;
  }

  try {
    const parsedSessionStore = JSON.parse(value);
    return { session, sessionKey, parsedSessionStore };
  } catch {
    await destroySession(session, sessionKey);
    return null;
  }
}
