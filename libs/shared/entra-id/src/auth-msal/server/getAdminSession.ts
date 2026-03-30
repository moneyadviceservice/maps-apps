import { GetServerSidePropsContext } from 'next';

import type { GetAdminSessionOptions, RedirectOrSession } from '../types';

export async function getAdminSession(
  context: GetServerSidePropsContext,
  options: GetAdminSessionOptions,
): Promise<RedirectOrSession> {
  const {
    getMsalInstance,
    loadSessionContext,
    redirectToLogin,
    destroySession,
    hydrateMsal,
    handleSessionRefresh,
    requireAdmin = false,
    adminRedirectPath = '/admin',
  } = options;

  const msalInstance = getMsalInstance();

  const result = await loadSessionContext(context);
  if (!result) return redirectToLogin(context);

  const { session, sessionKey, parsedSessionStore } = result;

  const account = await hydrateMsal(msalInstance, parsedSessionStore);
  if (!account) {
    await destroySession(session, sessionKey);
    return redirectToLogin(context);
  }

  const refreshed = await handleSessionRefresh(
    session,
    sessionKey,
    parsedSessionStore,
    msalInstance,
    account,
  );

  if (!refreshed) {
    await destroySession(session, sessionKey);
    return redirectToLogin(context);
  }

  if (requireAdmin && !session.isAdmin) {
    return {
      redirect: {
        destination: adminRedirectPath,
        permanent: false,
      },
    };
  }

  return session;
}
