import { GetServerSidePropsContext } from 'next';

import { IronSession, IronSessionData } from 'iron-session';
import { ConfidentialClientApplication } from '@azure/msal-node';

import { msalConfig } from '../config';
import { handleSessionRefresh } from './handleSessionRefresh';
import { hydrateMsal } from './hydrateMsal';
import { loadSessionContext } from './loadSessionContext';

const getMsalInstance = () => new ConfidentialClientApplication(msalConfig);

export const getUserSession = async (
  context: GetServerSidePropsContext,
): Promise<IronSession<IronSessionData> | null> => {
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
};
