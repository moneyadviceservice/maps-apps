import { NextApiRequest, NextApiResponse } from 'next';

import { Configuration, ConfidentialClientApplication } from '@azure/msal-node';

import { createProvider } from '../provider/createProvider';
import { getPostLogoutRedirectUri } from '../provider/getPostLogoutRedirectUri';
import { getSession } from '../session/getSession';
import type { SessionCookieConfig } from '../session/loadSessionContext';

export type CreateAppProviderOptions = {
  msalConfig: Configuration;
  sessionCookieConfig: SessionCookieConfig;
  getAdminAppRole: string;
  redirectUri: string;
  tenantSubdomain: string;
};

/**
 * Builds login, handleRedirect, logout for an app using the shared package.
 * Wires getMsalInstance, getSession (getIronSession), setAuthorityMetadata, getPostLogoutRedirectUri.
 */
export function createAppProvider(options: CreateAppProviderOptions) {
  const {
    msalConfig,
    sessionCookieConfig,
    getAdminAppRole,
    redirectUri,
    tenantSubdomain,
  } = options;

  const getMsalInstance = () => new ConfidentialClientApplication(msalConfig);

  const getSessionFn = (
    req: NextApiRequest,
    res: NextApiResponse,
    config: SessionCookieConfig,
  ) => getSession(req, res, config);

  const setAuthorityMetadata = (metadataJson: string) => {
    (msalConfig.auth as { authorityMetadata?: string }).authorityMetadata =
      metadataJson;
  };

  return createProvider({
    getMsalInstance,
    redirectUri,
    tenantSubdomain,
    authority: msalConfig.auth.authority ?? '',
    sessionCookieConfig,
    getSession: getSessionFn,
    getPostLogoutRedirectUri,
    getAdminAppRole,
    setAuthorityMetadata,
  });
}
