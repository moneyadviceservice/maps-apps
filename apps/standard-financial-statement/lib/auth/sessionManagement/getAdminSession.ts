import { GetServerSidePropsContext } from 'next';

import { RedirectOrSession } from 'lib/types';
import { ConfidentialClientApplication } from '@azure/msal-node';

import { msalConfig } from '../config';
import { redirectToLogin } from '../utils/redirectToLogin';
import { destroySession } from './destroySession';
import { handleSessionRefresh } from './handleSessionRefresh';
import { hydrateMsal } from './hydrateMsal';
import { loadSessionContext } from './loadSessionContext';

const getMsalInstance = () => new ConfidentialClientApplication(msalConfig);

export const getAdminSession = async (
  context: GetServerSidePropsContext,
  requireAdmin = false,
): Promise<RedirectOrSession> => {
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
        destination: `/admin`,
        permanent: false,
      },
    };
  }

  return session;
};
