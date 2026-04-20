import type { SessionCookieConfig } from './loadSessionContext';

export type CreateSessionCookieConfigOptions = {
  defaultCookieName?: string;
};

/**
 * Builds session cookie config from env (SESSION_SECRET, SESSION_NAME, NODE_ENV).
 * Use in apps to avoid duplicating the same env-reading logic.
 */
export function createSessionCookieConfig(
  options: CreateSessionCookieConfigOptions = {},
): SessionCookieConfig {
  const { defaultCookieName = '' } = options;
  return {
    password: process.env.SESSION_SECRET ?? '',
    cookieName: process.env.SESSION_NAME ?? defaultCookieName,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax' as const,
      path: '/',
    },
  };
}
