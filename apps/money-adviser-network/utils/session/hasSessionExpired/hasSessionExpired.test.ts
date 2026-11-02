import { JWTHeaderParameters, JWTVerifyResult } from 'jose';

import { hasSessionExpired } from './hasSessionExpired';

describe('hasSessionExpired', () => {
  const createSession = (
    expires: Date,
  ): JWTVerifyResult<Record<string, unknown>> => ({
    payload: { expires: expires.toISOString() },
    protectedHeader: {} as JWTHeaderParameters,
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns false - session is valid', async () => {
    const now = new Date();
    jest.setSystemTime(now);

    const expiry = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes in future
    const session = createSession(expiry);

    const result = await hasSessionExpired(session);
    expect(result).toBe(false);
  });

  it('returns true when session is not valid', async () => {
    const now = new Date();
    jest.setSystemTime(now);

    const expiry = new Date(now.getTime() - 10 * 60 * 1000); // 10 minutes ago
    const session = createSession(expiry);

    const result = await hasSessionExpired(session);
    expect(result).toBe(true);
  });

  it('returns true when session expires exactly now', async () => {
    const now = new Date();
    jest.setSystemTime(now);

    const expiry = new Date();
    const session = createSession(expiry);

    const result = await hasSessionExpired(session);
    expect(result).toBe(true);
  });
});
