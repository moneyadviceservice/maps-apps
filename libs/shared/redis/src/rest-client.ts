interface RedisRestConfig {
  baseUrl?: string;
  apiKey?: string;
}

// Standardized response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GetResponse {
  key: string;
  value: string | null;
  site: string;
}

export interface DeleteResponse {
  key: string;
  deletedCount: number;
  site: string;
}

export interface GetHashResponse {
  key: string;
  value: Record<string, string>;
  site: string;
}

export interface SetHashResponse {
  success: boolean;
  setCount: number;
  site: string;
}

export interface SetResponse {
  success: boolean;
  site: string;
}

export interface ErrorResponse {
  error: string;
}

// Type guard
export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as ErrorResponse).error === 'string'
  );
}

export class RequestEntityTooLargeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestEntityTooLargeError';
  }
}

export class RedisRestClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(config: RedisRestConfig) {
    this.baseUrl = config.baseUrl?.replace(/\/$/, '') ?? '';

    this.headers = {
      'Content-Type': 'application/json',
    };

    if (config.apiKey) {
      this.headers['x-api-key'] = config.apiKey;
    }
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: this.headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    return this.parseResponse<T>(response);
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const errorText = await response.text();

    console.error(
      `[Redis REST] ${response.url} failed:`,
      response.status,
      response.statusText,
      errorText.substring(0, 500),
    );

    if (
      response.status === 413 ||
      errorText.toLowerCase().includes('request entity too large')
    ) {
      throw new RequestEntityTooLargeError(
        `Request entity too large: ${errorText.substring(0, 200)}`,
      );
    }

    throw new Error(
      `Redis REST API error: ${response.status} ${
        response.statusText
      } - ${errorText.substring(0, 200)}`,
    );
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      try {
        return JSON.parse(text) as T;
      } catch {
        return text as T;
      }
    }

    const data = await response.json();

    // Unwrap nested result field if present
    if (data && typeof data === 'object' && 'result' in data) {
      return data.result as T;
    }

    return data as T;
  }

  async get(key: string): Promise<ApiResponse<GetResponse>> {
    try {
      const data = await this.request<GetResponse>('POST', '/api/get', { key });
      return { success: true, data };
    } catch (error) {
      console.error('[Redis REST] get error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async set(
    key: string,
    value: string,
    options?: { ttlSeconds?: number },
  ): Promise<ApiResponse<SetResponse>> {
    try {
      const data = await this.request<SetResponse>('POST', '/api/set', {
        key,
        value,
        ttlSeconds: options?.ttlSeconds,
      });
      return { success: true, data };
    } catch (error) {
      console.error('[Redis REST] set error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async del(key: string): Promise<ApiResponse<DeleteResponse>> {
    try {
      const data = await this.request<DeleteResponse>('POST', '/api/del', {
        key,
      });
      return { success: true, data };
    } catch (error) {
      console.error('[Redis REST] del error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getHash(key: string): Promise<ApiResponse<GetHashResponse>> {
    try {
      const data = await this.request<GetHashResponse>('POST', '/api/getHash', {
        key,
      });
      return { success: true, data };
    } catch (error) {
      console.error('[Redis REST] getHash error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async setHash(
    key: string,
    value: Record<string, string>,
    options?: { ttlSeconds?: number },
  ): Promise<ApiResponse<SetHashResponse>> {
    try {
      const body: {
        key: string;
        value: Record<string, string>;
        ttlSeconds?: number;
      } = { key, value };

      if (options?.ttlSeconds !== undefined) {
        body.ttlSeconds = options.ttlSeconds;
      }

      const data = await this.request<SetHashResponse>(
        'POST',
        '/api/setHash',
        body,
      );
      return { success: true, data };
    } catch (error) {
      console.error('[Redis REST] setHash error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

let restClient: RedisRestClient | null = null;

export async function getRedisRestClient(): Promise<RedisRestClient> {
  restClient ??= await initializeRestClient();
  return restClient;
}

async function initializeRestClient(): Promise<RedisRestClient> {
  const baseUrl = process.env.REDIS_API_URL;
  const apiKey = process.env.REDIS_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      'REDIS_API_URL or REDIS_API_KEY environment variables are missing',
    );
  }

  return new RedisRestClient({
    baseUrl,
    apiKey,
  });
}

export function __resetRestClientForTests() {
  restClient = null;
}

const DEFAULT_TTL_OPTIONS = { ttlSeconds: 3600 };

/**
 * Gets a value from Redis by key.
 * @param key The key to retrieve the value for.
 * @returns ApiResponse with GetResponse data on success, error message on failure
 */
export async function redisRestGet(
  key: string,
): Promise<ApiResponse<GetResponse>> {
  const client = await getRedisRestClient();
  return client.get(key);
}

/**
 * Get the hash value from Redis by key
 * @param key to retrieve the hash values.
 * @returns ApiResponse with GetHashResponse data on success, error message on failure
 */
export async function redisRestGetHash(
  key: string,
): Promise<ApiResponse<GetHashResponse>> {
  const client = await getRedisRestClient();
  return client.getHash(key);
}

/**
 * Sets a key-value pair in Redis.
 * Used to create or update a record. e.g. store initialization of a form entry.
 * If the key already exists, it will overwrite the existing value.
 * If the key does not exist, it will create a new key-value pair.
 * If ttlSeconds is provided it will expire based on this value.
 * @param key
 * @param value
 * @param options - Optional configuration including ttlSeconds (default: 3600)
 * @returns ApiResponse with SetResponse data on success, error message on failure
 */
export async function redisRestSet(
  key: string,
  value: string,
  options?: { ttlSeconds?: number },
): Promise<ApiResponse<SetResponse>> {
  const client = await getRedisRestClient();
  return client.set(key, value, options ?? DEFAULT_TTL_OPTIONS);
}

/**
 * Sets a field-value pair in Redis as Redis Hash data type
 * Used to create or update a record.
 * If the key already exists, it will overwrite the existing value.
 * If the key does not exist, it will create a new key-value pair.
 * If ttlSeconds is provided it will expire based on this value.
 *
 * @param key
 * @param value
 * @param options - Optional configuration including ttlSeconds (default: 3600)
 * @returns ApiResponse with SetHashResponse data on success, error message on failure
 */
export async function redisRestSetHash(
  key: string,
  value: Record<string, string>,
  options?: { ttlSeconds?: number },
): Promise<ApiResponse<SetHashResponse>> {
  const client = await getRedisRestClient();
  return client.setHash(key, value, options ?? DEFAULT_TTL_OPTIONS);
}

/**
 * Deletes a key from Redis.
 * @param key
 * @returns ApiResponse with DeleteResponse data on success, error message on failure
 */
export async function redisRestDel(
  key: string,
): Promise<ApiResponse<DeleteResponse>> {
  const client = await getRedisRestClient();
  return client.del(key);
}
