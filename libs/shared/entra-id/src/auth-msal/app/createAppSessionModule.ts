import { Configuration } from '@azure/msal-node';

import { createAppSessionManagement } from './createAppSessionManagement';
import { createSessionCookieConfig } from '../session/createSessionCookieConfig';
import { createWithSession } from '../api/createWithSession';

export type CreateAppSessionModuleOptions = {
  msalConfig: Configuration;
  defaultCookieName?: string;
  adminRedirectPath?: string;
};

/**
 * Single factory for app session setup: cookie config, session management, and withSession.
 * Use in app sessionManagement so apps only pass msalConfig and app-specific options.
 */
export function createAppSessionModule(options: CreateAppSessionModuleOptions) {
  const { msalConfig, defaultCookieName, adminRedirectPath } = options;

  const sessionCookieConfig = createSessionCookieConfig({
    defaultCookieName,
  });

  const { getAdminSession, getUserSession, redirectToLogin } =
    createAppSessionManagement({
      msalConfig,
      sessionCookieConfig,
      adminRedirectPath,
    });

  const withSession = createWithSession(sessionCookieConfig);

  return {
    getAdminSession,
    getUserSession,
    redirectToLogin,
    sessionCookieConfig,
    withSession,
  };
}
