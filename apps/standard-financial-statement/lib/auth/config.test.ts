describe('msalConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      TENANT_SUBDOMAIN: 'my-tenant',
      REDIRECT_URI: 'http://localhost:3000/auth/redirect',
      ENTRA_CLIENT_ID_SIGN_IN: 'fake-client-id',
      AZURE_AD_CLIENT_SECRET_SIGN_IN: 'fake-secret',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should load configuration with environment variables', async () => {
    const { msalConfig, TENANT_SUBDOMAIN, REDIRECT_URI, CLIENT_ID } =
      await import('./config');

    expect(TENANT_SUBDOMAIN).toBe('my-tenant');
    expect(REDIRECT_URI).toBe('http://localhost:3000/auth/redirect');
    expect(CLIENT_ID).toBe('fake-client-id');

    expect(msalConfig.auth.clientId).toBe('fake-client-id');
    expect(msalConfig.auth.authority).toBe('https://my-tenant.ciamlogin.com/');
    expect(msalConfig.auth.clientSecret).toBe('fake-secret');
    expect(typeof msalConfig?.system?.loggerOptions?.loggerCallback).toBe(
      'function',
    );
  });

  it('should log messages in non-production mode', async () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
    });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn());

    const { msalConfig } = await import('./config');
    msalConfig?.system?.loggerOptions?.loggerCallback &&
      msalConfig.system.loggerOptions.loggerCallback(1, 'Test message', false);

    expect(consoleSpy).toHaveBeenCalledWith('[MSAL][Warning] Test message');
    consoleSpy.mockRestore();
  });

  it('should skip logging PII in production', async () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
    });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn());

    const { msalConfig } = await import('./config');
    msalConfig?.system?.loggerOptions?.loggerCallback &&
      msalConfig.system.loggerOptions.loggerCallback(1, 'PII data here', true);

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
