import { GetServerSidePropsContext } from 'next';

import { IronSession } from 'iron-session';

import type { GetUserSessionOptions, MsalSessionData } from '../types';

export async function getUserSession(
  context: GetServerSidePropsContext,
  options: GetUserSessionOptions,
): Promise<IronSession<MsalSessionData> | null> {
  const {
    getMsalInstance,
    loadSessionContext,
    hydrateMsal,
    handleSessionRefresh,
  } = options;

  const msalInstance = getMsalInstance();

  const result = await loadSessionContext(context);
  if (!result) return null;

  const { session, sessionKey, parsedSessionStore } = result;

  const account = await hydrateMsal(msalInstance, parsedSessionStore);
  if (!account) return null;

  const refreshed = await handleSessionRefresh(
    session,
    sessionKey,
    parsedSessionStore,
    msalInstance,
    account,
  );

  if (!refreshed) return null;

  return session;
}
