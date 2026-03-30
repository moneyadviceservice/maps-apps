describe('msalConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      TENANT_SUBDOMAIN: 'my-tenant',
      REDIRECT_URI: 'http://localhost:3000/auth/redirect',
      ENTRA_CLIENT_ID: 'fake-client-id',
      ENTRA_CLIENT_SECRET: 'fake-secret',
      ADMIN_APP_ROLE: 'tid_admin',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  async function runLoggerTest(
    nodeEnv: string,
    logLevel: number,
    message: string,
    containsPii: boolean,
    expectedLog?: string[],
  ) {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: nodeEnv,
      writable: true,
    });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn());
    const { msalConfig } = await import('./config');
    msalConfig?.system?.loggerOptions?.loggerCallback?.(
      logLevel,
      message,
      containsPii,
    );
    if (expectedLog) {
      expect(consoleSpy).toHaveBeenCalledWith(...expectedLog);
    } else {
      expect(consoleSpy).not.toHaveBeenCalled();
    }
    consoleSpy.mockRestore();
  }

  it('should load configuration with environment variables', async () => {
    const {
      msalConfig,
      TENANT_SUBDOMAIN,
      REDIRECT_URI,
      CLIENT_ID,
      ADMIN_APP_ROLE,
    } = await import('./config');

    expect(TENANT_SUBDOMAIN).toBe('my-tenant');
    expect(REDIRECT_URI).toBe('http://localhost:3000/auth/redirect');
    expect(CLIENT_ID).toBe('fake-client-id');
    expect(ADMIN_APP_ROLE).toBe('tid_admin');

    expect(msalConfig.auth.clientId).toBe('fake-client-id');
    expect(msalConfig.auth.authority).toBe('https://my-tenant.ciamlogin.com/');
    expect(msalConfig.auth.clientSecret).toBe('fake-secret');
    expect(typeof msalConfig?.system?.loggerOptions?.loggerCallback).toBe(
      'function',
    );
  });

  it('should default ADMIN_APP_ROLE to tid_admin when ADMIN_APP_ROLE is not set', async () => {
    delete process.env.ADMIN_APP_ROLE;
    const { ADMIN_APP_ROLE } = await import('./config');
    expect(ADMIN_APP_ROLE).toBe('tid_admin');
  });

  it('should default CLIENT_ID to empty string when ENTRA_CLIENT_ID is not set', async () => {
    delete process.env.ENTRA_CLIENT_ID;
    const { CLIENT_ID } = await import('./config');
    expect(CLIENT_ID).toBe('');
  });

  it('should log messages in non-production mode', () =>
    runLoggerTest('development', 1, 'Test message', false, [
      '[MSAL][Warning] Test message',
    ]));

  it('should skip logging PII in production', () =>
    runLoggerTest('production', 1, 'PII data here', true));

  it('should log in production when containsPii is false', () =>
    runLoggerTest('production', 1, 'Non-PII message', false, [
      '[MSAL][Warning] Non-PII message',
    ]));
});
