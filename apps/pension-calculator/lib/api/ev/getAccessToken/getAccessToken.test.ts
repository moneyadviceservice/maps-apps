import type { redisRestGet } from '@maps-react/redis/rest-client';

jest.mock('@maps-react/redis/rest-client');

describe('getAccessToken', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = {
      ...ORIGINAL_ENV,
      EV_API_ACCESS_TOKEN_URL: 'https://api.example.com/token',
      REDIS_EV_ACCESS_TOKEN_CACHE_KEY: 'ev_access_token_key',
      EV_CONSUMER_KEY: 'test-client-id',
      EV_CONSUMER_SECRET: 'test-client-secret',
    };
    global.fetch = jest.fn();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  // Helper to load fresh module and matching mock references after resetModules
  async function loadModule() {
    jest.resetModules();
    const redisModule = await import('@maps-react/redis/rest-client');
    const tokenModule = await import('./getAccessToken');

    return {
      getAccessToken: tokenModule.getAccessToken,
      mockRedisGet: redisModule.redisRestGet as jest.MockedFunction<
        typeof redisModule.redisRestGet
      >,
      mockRedisSet: redisModule.redisRestSet as jest.MockedFunction<
        typeof redisModule.redisRestSet
      >,
    };
  }

  it('should throw an error if required environment variables are missing', async () => {
    delete process.env.EV_API_ACCESS_TOKEN_URL;

    const { getAccessToken } = await loadModule();

    await expect(getAccessToken()).rejects.toThrow(
      'Missing required environment variables for access token retrieval',
    );
  });

  it('should return cached token on Redis cache hit without calling fetch', async () => {
    const { getAccessToken, mockRedisGet, mockRedisSet } = await loadModule();

    mockRedisGet.mockResolvedValueOnce({
      data: { value: 'cached-token-123' },
    } as unknown as ReturnType<typeof redisRestGet>);

    const token = await getAccessToken();

    expect(token).toBe('cached-token-123');
    expect(mockRedisGet).toHaveBeenCalledWith('ev_access_token_key');
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockRedisSet).not.toHaveBeenCalled();
  });

  it('should fetch a new token, cache it in Redis, and return it on cache miss', async () => {
    const { getAccessToken, mockRedisGet, mockRedisSet } = await loadModule();

    mockRedisGet.mockResolvedValueOnce({ data: null } as unknown as ReturnType<
      typeof redisRestGet
    >);

    const mockToken = 'new-access-token-xyz';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ access_token: mockToken }),
    });

    const token = await getAccessToken();
    const expectedCredentials = Buffer.from(
      'test-client-id:test-client-secret',
    ).toString('base64');

    expect(token).toBe(mockToken);
    expect(mockRedisGet).toHaveBeenCalledWith('ev_access_token_key');
    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${expectedCredentials}`,
      },
      body: 'grant_type=client_credentials',
    });
    expect(mockRedisSet).toHaveBeenCalledWith(
      'ev_access_token_key',
      mockToken,
      { ttlSeconds: 3300 },
    );
  });

  it('should throw an error if the fetch call fails', async () => {
    const { getAccessToken, mockRedisGet, mockRedisSet } = await loadModule();

    mockRedisGet.mockResolvedValueOnce({ data: null } as unknown as ReturnType<
      typeof redisRestGet
    >);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getAccessToken()).rejects.toThrow('Token generation failed');
    expect(mockRedisSet).not.toHaveBeenCalled();
  });
});
