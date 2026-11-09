/**
 * Session and cookie config for this app. Re-exported from the shared session module.
 */
import { createAppSessionModule } from '@maps-react/entra-id/auth-msal';

import { msalConfig } from './config';

const {
  getAdminSession,
  getUserSession,
  redirectToLogin,
  sessionCookieConfig,
  withSession,
} = createAppSessionModule({
  msalConfig,
  defaultCookieName: '',
  adminRedirectPath: '/admin',
});

export {
  getAdminSession,
  getUserSession,
  redirectToLogin,
  sessionCookieConfig,
  withSession,
};
