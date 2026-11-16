import { GetServerSidePropsContext } from 'next';

import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';

import { createSessionHelpers } from '../server/createSessionHelpers';
import { redirectToLogin as redirectToLoginPackage } from '../server/redirectToLogin';
import { destroySession as destroySessionPackage } from '../session/destroySession';
import { getSession } from '../session/getSession';
import { handleSessionRefresh as handleSessionRefreshPackage } from '../session/handleSessionRefresh';
import { hydrateMsal } from '../session/hydrateMsal';
import type {
  GetSessionFn,
  SessionCookieConfig,
} from '../session/loadSessionContext';
import { loadSessionContext as loadSessionContextPackage } from '../session/loadSessionContext';

export type CreateAppSessionManagementOptions = {
  msalConfig: Configuration;
  sessionCookieConfig: SessionCookieConfig;
  adminRedirectPath?: string;
};

/**
 * Builds getAdminSession, getUserSession, and redirectToLogin for an app using
 * the shared package. Use this in app sessionManagement to avoid duplicating
 * the same wiring (getSession, loadSessionContext, destroySession, etc.).
 */
export function createAppSessionManagement(
  options: CreateAppSessionManagementOptions,
) {
  const { msalConfig, sessionCookieConfig, adminRedirectPath } = options;

  const getMsalInstance = () => new ConfidentialClientApplication(msalConfig);

  const getSessionFn: GetSessionFn = (req, res, config) =>
    getSession(
      req as Parameters<typeof getSession>[0],
      res as Parameters<typeof getSession>[1],
      config,
    );

  const loadSessionContext = (context: GetServerSidePropsContext) =>
    loadSessionContextPackage(context, {
      getSession: getSessionFn,
      sessionCookieConfig,
    });

  const destroySession = (
    session: Parameters<typeof destroySessionPackage>[0],
    sessionKey: string,
  ) => destroySessionPackage(session, sessionKey);

  const handleSessionRefresh = (
    session: Parameters<typeof handleSessionRefreshPackage>[0],
    sessionKey: string,
    parsed: Parameters<typeof handleSessionRefreshPackage>[2],
    msalInstance: Parameters<typeof handleSessionRefreshPackage>[3],
    account: Parameters<typeof handleSessionRefreshPackage>[4],
  ) =>
    handleSessionRefreshPackage(
      session,
      sessionKey,
      parsed,
      msalInstance,
      account,
    );

  const helpers = createSessionHelpers({
    getMsalInstance,
    loadSessionContext,
    redirectToLogin: redirectToLoginPackage,
    destroySession,
    hydrateMsal,
    handleSessionRefresh,
    adminRedirectPath: adminRedirectPath ?? '/admin',
  });

  return {
    getAdminSession(context: GetServerSidePropsContext, requireAdmin = false) {
      return helpers.getAdminSession(context, requireAdmin);
    },
    getUserSession(context: GetServerSidePropsContext) {
      return helpers.getUserSession(context);
    },
    redirectToLogin: redirectToLoginPackage,
  };
}
