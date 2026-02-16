import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';

import { BACKEND_TIMEOUT_SECONDS, COOKIE_OPTIONS } from '../../constants';
import { UserSession } from '../../types';

export interface MhpdSessionConfig {
  authorizationCode: string;
  userSessionId: string;
  redirectUrl: string;
  currentUrl: string;
  supportCurrentUrl: string;
  channel: string;
  pensionID: string;
  sessionTimeout: string;
  sessionStart: string;
  analyticsDataSent?: boolean;
}

const EMPTY_SESSION_CONFIG: MhpdSessionConfig = {
  authorizationCode: '',
  userSessionId: '',
  redirectUrl: '',
  currentUrl: '',
  supportCurrentUrl: '',
  channel: '',
  pensionID: '',
  sessionTimeout: '',
  sessionStart: '',
  analyticsDataSent: false,
};

/**
 * Get the consolidated session configuration from cookies
 */
export const getMhpdSessionConfig = (cookies: Cookies): MhpdSessionConfig => {
  const consolidatedCookie = cookies.get('mhpdSessionConfig');

  if (!consolidatedCookie) {
    return EMPTY_SESSION_CONFIG;
  }

  try {
    return { ...EMPTY_SESSION_CONFIG, ...JSON.parse(consolidatedCookie) };
  } catch {
    return EMPTY_SESSION_CONFIG;
  }
};

/**
 * Set the consolidated session configuration cookie
 */
export const setMhpdSessionConfig = (
  cookies: Cookies,
  config: Partial<MhpdSessionConfig>,
): void => {
  const updatedConfig = { ...getMhpdSessionConfig(cookies), ...config };
  cookies.set(
    'mhpdSessionConfig',
    JSON.stringify(updatedConfig),
    COOKIE_OPTIONS,
  );
};

/**
 * Clear the consolidated session configuration cookie
 */
export const clearMhpdSessionConfig = (cookies: Cookies): void => {
  cookies.set('mhpdSessionConfig', '', {
    ...COOKIE_OPTIONS,
    expires: new Date(0),
  });
};

/**
 * Update a single field in the session configuration
 */
export const updateSessionConfigField = (
  cookies: Cookies,
  field: keyof MhpdSessionConfig,
  value: string,
): void => {
  setMhpdSessionConfig(cookies, { [field]: value });
};

/**
 * Get user session data from cookies
 */
export const getUserSessionFromCookies = (cookies: Cookies): UserSession => {
  const { userSessionId, authorizationCode, sessionStart } =
    getMhpdSessionConfig(cookies);

  return {
    userSessionId,
    authorizationCode,
    sessionStart,
  } as UserSession;
};

/**
 * Check if a session has expired based on session start time
 */
export const isSessionExpired = async (
  sessionStart?: string,
): Promise<boolean> => {
  if (!sessionStart || sessionStart === '') {
    return false;
  }

  const sessionStartTime = Number.parseInt(sessionStart);
  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);

  return sessionDuration >= BACKEND_TIMEOUT_SECONDS;
};

type AuthConfig = {
  requireAuth?: boolean;
};

/**
 * Higher-order function that wraps getServerSideProps with authentication checking
 */
export function withAuth(
  getServerSideProps: GetServerSideProps,
  config: AuthConfig = {},
): GetServerSideProps {
  return async (context: GetServerSidePropsContext) => {
    const { requireAuth = true } = config;

    if (requireAuth) {
      try {
        const cookies = new Cookies(context.req, context.res);
        const { userSessionId } = getMhpdSessionConfig(cookies);

        if (!userSessionId) {
          return { notFound: true };
        }
      } catch (error) {
        console.error('withAuth error:', error);
        return { notFound: true };
      }
    }

    // Call the original getServerSideProps
    return await getServerSideProps(context);
  };
}
