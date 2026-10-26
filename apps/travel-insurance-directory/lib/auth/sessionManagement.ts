/**
 * Session and cookie config for this app.
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
  defaultCookieName: 'tid_admin_session',
  adminRedirectPath: '/admin',
});

export {
  getAdminSession,
  getUserSession,
  redirectToLogin,
  sessionCookieConfig,
  withSession,
};
