describe('sessionCookieConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should default to empty strings if env vars are not set', async () => {
    process.env.SESSION_SECRET = '';
    process.env.SESSION_NAME = '';
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'dev',
      writable: true,
    });

    const { sessionCookieConfig } = await import('./sessionCookieConfig');

    expect(sessionCookieConfig.password).toBe('');
    expect(sessionCookieConfig.cookieName).toBe('');
    expect(sessionCookieConfig.cookieOptions.secure).toBe(false);
  });

  it('should read from environment variables and set secure to true in production', async () => {
    process.env.SESSION_SECRET = 'supersecret';
    process.env.SESSION_NAME = 'my-session';

    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
    });

    const { sessionCookieConfig } = await import('./sessionCookieConfig');

    expect(sessionCookieConfig.password).toBe('supersecret');
    expect(sessionCookieConfig.cookieName).toBe('my-session');
    expect(sessionCookieConfig.cookieOptions.secure).toBe(true);
  });
});
