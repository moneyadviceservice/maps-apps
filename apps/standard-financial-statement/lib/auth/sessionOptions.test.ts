describe('sessionOptions', () => {
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

    const { sessionOptions } = await import('./sessionOptions');

    expect(sessionOptions.password).toBe('');
    expect(sessionOptions.cookieName).toBe('');
    expect(sessionOptions.cookieOptions.secure).toBe(false);
  });

  it('should read from environment variables and set secure to true in production', async () => {
    process.env.SESSION_SECRET = 'supersecret';
    process.env.SESSION_NAME = 'my-session';

    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
    });

    const { sessionOptions } = await import('./sessionOptions');

    expect(sessionOptions.password).toBe('supersecret');
    expect(sessionOptions.cookieName).toBe('my-session');
    expect(sessionOptions.cookieOptions.secure).toBe(true);
  });
});
