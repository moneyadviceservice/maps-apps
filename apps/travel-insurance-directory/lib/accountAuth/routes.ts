import { DEFAULT_LANGUAGE_HOME } from 'types/CONSTANTS';

export const accountAuthRoutes = {
  pages: {
    login: '/account/login',
    accountHome: '/account',
    landing: DEFAULT_LANGUAGE_HOME,
  },
  api: {
    start: '/api/account-auth/start',
    verify: '/api/account-auth/verify',
    reset: '/api/account-auth/reset',
    signout: '/api/account-auth/signout',
  },
} as const;
