describe('registerSessionOptions', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('sets cookieOptions.secure to false when NOT in production', async () => {
    process.env.REGISTER_SESSION_SECRET = 'my-secret-key';

    const { registerSessionOptions } = await import('./registerSessionOptions');

    expect(registerSessionOptions).toEqual({
      cookieName: 'tid_register_session',
      password: 'my-secret-key',
      cookieOptions: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      },
    });
  });

  it('defaults to empty string if REGISTER_SESSION_SECRET is missing', async () => {
    delete process.env.REGISTER_SESSION_SECRET;

    const { registerSessionOptions } = await import('./registerSessionOptions');

    expect(registerSessionOptions.password).toBe('');
  });
});
