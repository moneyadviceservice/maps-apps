import { getCookieName } from './getCookieName';

describe('getCookieName', () => {
  const originalEnv = process.env.COOKIE_NAME;

  afterEach(() => {
    process.env.COOKIE_NAME = originalEnv;
  });

  it('should return the cookie name from the environment variable', () => {
    process.env.COOKIE_NAME = 'fsid';

    expect(getCookieName()).toBe('fsid');
  });

  it('should throw an error if the COOKIE_NAME environment variable is not set', () => {
    delete process.env.COOKIE_NAME;

    expect(() => getCookieName()).toThrow(
      'COOKIE_NAME environment variable is required',
    );
  });
});
