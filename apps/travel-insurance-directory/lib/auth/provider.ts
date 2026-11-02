import { createAppProvider } from '@maps-react/entra-id/auth-msal';

import {
  ADMIN_APP_ROLE,
  msalConfig,
  REDIRECT_URI,
  TENANT_SUBDOMAIN,
} from './config';
import { sessionCookieConfig } from './sessionManagement';

const { login, handleRedirect, logout } = createAppProvider({
  msalConfig,
  sessionCookieConfig,
  getAdminAppRole: ADMIN_APP_ROLE,
  redirectUri: REDIRECT_URI ?? '',
  tenantSubdomain: TENANT_SUBDOMAIN ?? '',
});

export { handleRedirect, login, logout };
