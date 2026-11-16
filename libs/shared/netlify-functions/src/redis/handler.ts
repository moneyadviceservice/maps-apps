import { Config } from '@netlify/functions';

// Valid operations
export const VALID_OPERATIONS = [
  'get',
  'set',
  'del',
  'getHash',
  'setHash',
] as const;

export type RedisOperation = (typeof VALID_OPERATIONS)[number];

/**
 * Netlify function handler that proxies Redis operations to an external Redis API.
 * This handler validates the operation and forwards the request to the configured Redis API.
 *
 * @param req - The incoming Request object from Netlify Functions
 * @returns Response with the Redis API result or an error
 */
export async function redisNetlifyFunctionHandler(
  req: Request,
): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(null, {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Extract operation from pathname or query parameter
    // Config paths are /fn/{operation}, redirect may use query param
    const url = new URL(req.url);
    const pathRegex = /\/fn\/(\w+)$/;
    const pathMatch = pathRegex.exec(url.pathname);
    const operation = url.searchParams.get('operation') || pathMatch?.[1];

    if (!operation) {
      return new Response(
        JSON.stringify({
          error: 'Invalid path format. Expected /fn/{operation}',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Validate operation
    if (!VALID_OPERATIONS.includes(operation as RedisOperation)) {
      return new Response(
        JSON.stringify({ error: `Invalid operation: ${operation}` }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const endpoint = `/api/${operation}`;

    const body = await req.json();
    const redisApiUrl = process.env.REDIS_API_URL;
    const redisApiKey = process.env.REDIS_API_KEY;

    if (!redisApiUrl || !redisApiKey) {
      return new Response(
        JSON.stringify({ error: 'Redis API configuration missing' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const response = await fetch(`${redisApiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': redisApiKey,
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.text();

    return new Response(responseData, {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('[Netlify Redis Proxy] error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

/**
 * Netlify Functions configuration for Redis operations.
 * Use this as the default export config in your Netlify function file.
 */
export const redisNetlifyFunctionConfig: Config = {
  path: ['/fn/get', '/fn/set', '/fn/del', '/fn/getHash', '/fn/setHash'],
};
