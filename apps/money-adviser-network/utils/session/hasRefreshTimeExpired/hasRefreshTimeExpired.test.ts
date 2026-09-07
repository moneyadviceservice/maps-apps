import { JWTVerifyResult } from 'jose';

import { hasRefreshTimeExpired } from './hasRefreshTimeExpired';

describe('hasRefreshTimeExpired', () => {
  it('returns true when refresh time is in the past', async () => {
    const pastDate = new Date(Date.now() - 60_000).toISOString(); // 1 min ago

    const mockSession = {
      payload: { sessionRefreshTime: pastDate },
    } as unknown as JWTVerifyResult<Record<string, unknown>>;

    const result = await hasRefreshTimeExpired(mockSession);

    expect(result).toBe(true);
  });

  it('returns false when refresh time is in the future', async () => {
    const futureDate = new Date(Date.now() + 60_000).toISOString(); // 1 min ahead

    const mockSession = {
      payload: { sessionRefreshTime: futureDate },
    } as unknown as JWTVerifyResult<Record<string, unknown>>;

    const result = await hasRefreshTimeExpired(mockSession);

    expect(result).toBe(false);
  });
});
