import Cookies from 'cookies';

import { COOKIE_OPTIONS } from '../constants';

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
