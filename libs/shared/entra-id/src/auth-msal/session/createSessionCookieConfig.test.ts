import { createSessionCookieConfig } from './createSessionCookieConfig';

const originalEnv = process.env;

describe('createSessionCookieConfig', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('uses default options when not provided', () => {
    delete process.env.SESSION_SECRET;
    delete process.env.SESSION_NAME;
    const config = createSessionCookieConfig();
    expect(config.cookieName).toBe('');
    expect(config.password).toBe('');
    expect(config.cookieOptions.secure).toBe(false);
  });

  it('uses defaultCookieName when SESSION_NAME is not set', () => {
    delete process.env.SESSION_SECRET;
    delete process.env.SESSION_NAME;
    const config = createSessionCookieConfig({
      defaultCookieName: 'app_session',
    });
    expect(config.cookieName).toBe('app_session');
  });

  it('prefers SESSION_NAME over defaultCookieName', () => {
    process.env.SESSION_NAME = 'env-session';
    const config = createSessionCookieConfig({
      defaultCookieName: 'default',
    });
    expect(config.cookieName).toBe('env-session');
  });

  it('sets secure to true when NODE_ENV is production', () => {
    process.env.SESSION_SECRET = 'secret';
    process.env.SESSION_NAME = 's';
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
    });
    const config = createSessionCookieConfig();
    expect(config.cookieOptions.secure).toBe(true);
  });
});
