const ACCESS_TOKEN_API_URL = process.env.EV_API_ACCESS_TOKEN_URL;
const REDIS_CACHE_KEY = process.env.REDIS_EV_ACCESS_TOKEN_CACHE_KEY;

export async function getAccessToken(): Promise<string> {
  const { redisRestGet, redisRestSet } = await import(
    '@maps-react/redis/rest-client'
  );

  if (!ACCESS_TOKEN_API_URL || !REDIS_CACHE_KEY) {
    throw new Error(
      'Missing required environment variables for access token retrieval',
    );
  }

  // 1. Try reading central cache
  const cachedToken = await redisRestGet(REDIS_CACHE_KEY);

  if (cachedToken?.data?.value) return cachedToken.data?.value;

  const credentials = `${process.env.EV_CONSUMER_KEY}:${process.env.EV_CONSUMER_SECRET}`;
  const base64Auth = Buffer.from(credentials).toString('base64');

  // 2. Fetch new token on miss/expiration
  const response = await fetch(ACCESS_TOKEN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${base64Auth}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }).toString(),
  });

  if (!response.ok) throw new Error('Token generation failed');
  const data = await response.json();

  // 3. Cache in Redis with 55-minute TTL (3300 seconds) to cushion a 1-hour expiry
  await redisRestSet(REDIS_CACHE_KEY, data.access_token, { ttlSeconds: 3300 });

  return data.access_token;
}
