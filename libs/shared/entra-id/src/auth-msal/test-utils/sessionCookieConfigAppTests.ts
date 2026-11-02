/**
 * Shared test suite for sessionCookieConfig (same pattern in TID and SFS).
 * importConfig: () => import('./sessionCookieConfig') or similar
 * defaultCookieName: e.g. 'tid_admin_session' for TID, '' for SFS
 */
export function runSessionCookieConfigTests(
  importConfig: () => Promise<{
    sessionCookieConfig: {
      password: string;
      cookieName: string;
      cookieOptions: { secure: boolean };
    };
  }>,
  defaultCookieName: string,
): void {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('defaults when env vars not set', async () => {
    delete process.env.SESSION_SECRET;
    delete process.env.SESSION_NAME;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'dev',
      writable: true,
    });

    const { sessionCookieConfig } = await importConfig();

    expect(sessionCookieConfig.password).toBe('');
    expect(sessionCookieConfig.cookieName).toBe(defaultCookieName);
    expect(sessionCookieConfig.cookieOptions.secure).toBe(false);
  });

  it('reads env and sets secure in production', async () => {
    process.env.SESSION_SECRET = 'supersecret';
    process.env.SESSION_NAME = 'my-session';
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
    });

    const { sessionCookieConfig } = await importConfig();

    expect(sessionCookieConfig.password).toBe('supersecret');
    expect(sessionCookieConfig.cookieName).toBe('my-session');
    expect(sessionCookieConfig.cookieOptions.secure).toBe(true);
  });
}
