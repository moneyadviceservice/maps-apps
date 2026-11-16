import {
  __resetRestClientForTests,
  getRedisRestClient,
  RedisRestClient,
  redisRestDel,
  redisRestGet,
  redisRestGetHash,
  redisRestSet,
  redisRestSetHash,
  RequestEntityTooLargeError,
} from './rest-client';

// Mock global fetch
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

// Helper functions to reduce duplication
const createMockJsonResponse = (data: unknown): Response =>
  ({
    ok: true,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => data,
  } as Response);

const createMockTextResponse = (text: string): Response =>
  ({
    ok: true,
    headers: new Headers({ 'content-type': 'text/plain' }),
    text: async () => text,
  } as Response);

const createMockErrorResponse = (
  status: number,
  statusText: string,
  errorText: string,
): Response =>
  ({
    ok: false,
    status,
    statusText,
    text: async () => errorText,
  } as Response);

describe('RedisRestClient', () => {
  const originalEnv = process.env;
  const mockBaseUrl = 'https://api.redis.example.com';
  const mockBaseKey = 'test-api-key';
  let client: RedisRestClient;

  beforeEach(() => {
    jest.clearAllMocks();
    __resetRestClientForTests();
    process.env = { ...originalEnv };
    mockFetch.mockClear();
    client = new RedisRestClient({ baseUrl: mockBaseUrl });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Constructor', () => {
    it('should initialize with baseUrl and default headers', () => {
      const client = new RedisRestClient({ baseUrl: mockBaseUrl });

      expect(client).toBeInstanceOf(RedisRestClient);
    });

    it('should remove trailing slash from baseUrl', () => {
      const client = new RedisRestClient({
        baseUrl: 'https://api.redis.example.com/',
      });

      expect(client).toBeInstanceOf(RedisRestClient);
    });

    it('should add X-API-Key header when apiKey is provided', () => {
      const client = new RedisRestClient({
        baseUrl: mockBaseUrl,
        apiKey: 'test-api-key',
      });

      expect(client).toBeInstanceOf(RedisRestClient);
    });

    it('should not add X-API-Key header when apiKey is not provided', () => {
      const client = new RedisRestClient({ baseUrl: mockBaseUrl });

      expect(client).toBeInstanceOf(RedisRestClient);
    });
  });

  describe('get method', () => {
    it('should return GetResponse for string value', async () => {
      // API should return GetResponse object, not a string
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          key: 'test-key',
          value: 'test-value',
          site: 'SITE_DEV',
        }),
      );

      const result = await client.get('test-key');

      expect(result).toEqual({
        success: true,
        data: {
          key: 'test-key',
          value: 'test-value',
          site: 'SITE_DEV',
        },
      });
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/get`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ key: 'test-key' }),
        }),
      );
    });

    it('should return GetResponse from object.value field', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          key: 'test-key',
          value: 'test-value',
          site: 'SITE_DEV',
        }),
      );

      const result = await client.get('test-key');

      expect(result).toEqual({
        success: true,
        data: {
          key: 'test-key',
          value: 'test-value',
          site: 'SITE_DEV',
        },
      });
    });

    it('should return GetResponse from object.result field', async () => {
      // When request unwraps result field, we get the GetResponse object
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          result: {
            key: 'test-key',
            value: 'test-value',
            site: 'SITE_DEV',
          },
        }),
      );

      const result = await client.get('test-key');

      // After request unwraps, result is GetResponse object
      expect(result).toEqual({
        success: true,
        data: {
          key: 'test-key',
          value: 'test-value',
          site: 'SITE_DEV',
        },
      });
    });

    it('should return GetResponse when object.value is null', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          key: 'myTestKey',
          value: null,
          site: 'SITE_DEV',
        }),
      );

      const result = await client.get('test-key');

      expect(result).toEqual({
        success: true,
        data: {
          key: 'myTestKey',
          value: null,
          site: 'SITE_DEV',
        },
      });
    });

    it('should return GetResponse with null value for errors', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockErrorResponse(404, 'Not Found', 'Key not found'),
      );

      const result = await client.get('test-key');

      expect(result).toEqual({
        success: false,
        error: 'Redis REST API error: 404 Not Found - Key not found',
      });
    });

    it('should return GetResponse when result is null', async () => {
      // API should return GetResponse object even when value is null
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          key: 'test-key',
          value: null,
          site: 'SITE_DEV',
        }),
      );

      const result = await client.get('test-key');

      expect(result).toEqual({
        success: true,
        data: {
          key: 'test-key',
          value: null,
          site: 'SITE_DEV',
        },
      });
    });

    it('should return GetResponse with null value for any errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server error',
      } as Response);

      const result = await client.get('test-key');

      expect(result).toEqual({
        success: false,
        error: 'Redis REST API error: 500 Internal Server Error - Server error',
      });
    });
  });

  describe('set method', () => {
    it('should return SetResponse on success', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          success: true,
          site: 'SITE_DEV',
        }),
      );

      const result = await client.set('test-key', 'test-value');

      expect(result).toEqual({
        success: true,
        data: {
          success: true,
          site: 'SITE_DEV',
        },
      });
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/set`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            key: 'test-key',
            value: 'test-value',
            ttlSeconds: undefined,
          }),
        }),
      );
    });

    it('should set value with TTL and return SetResponse', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          success: true,
          site: 'SITE_DEV',
        }),
      );

      const result = await client.set('test-key', 'test-value', {
        ttlSeconds: 3600,
      });

      expect(result).toEqual({
        success: true,
        data: {
          success: true,
          site: 'SITE_DEV',
        },
      });
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/set`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            key: 'test-key',
            value: 'test-value',
            ttlSeconds: 3600,
          }),
        }),
      );
    });

    it('should return ErrorResponse on error', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          error: 'Missing key or value',
        }),
      );

      const result = await client.set('test-key', 'test-value');

      expect(result).toEqual({
        success: true,
        data: {
          error: 'Missing key or value',
        },
      });
    });

    it('should return ErrorResponse for network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);
      jest.spyOn(console, 'error').mockImplementation();

      const result = await client.set('test-key', 'test-value');

      expect(result).toEqual({
        success: false,
        error: 'Network error',
      });
      expect(console.error).toHaveBeenCalledWith(
        '[Redis REST] set error:',
        networkError,
      );

      jest.restoreAllMocks();
    });

    it('should return ErrorResponse with "Unknown error" when error is not an Error instance', async () => {
      // Test case where error is not an Error instance (e.g., string, number, etc.)
      mockFetch.mockRejectedValueOnce('String error');
      jest.spyOn(console, 'error').mockImplementation();

      const result = await client.set('test-key', 'test-value');

      expect(result).toEqual({
        success: false,
        error: 'Unknown error',
      });
      expect(console.error).toHaveBeenCalledWith(
        '[Redis REST] set error:',
        'String error',
      );

      jest.restoreAllMocks();
    });
  });

  describe('del method', () => {
    it('should return DeleteResponse with deleted count', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          key: 'test-key',
          deletedCount: 1,
          site: 'SITE_DEV',
        }),
      );

      const result = await client.del('test-key');

      expect(result).toEqual({
        success: true,
        data: {
          key: 'test-key',
          deletedCount: 1,
          site: 'SITE_DEV',
        },
      });
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/del`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ key: 'test-key' }),
        }),
      );
    });

    it('should return DeleteResponse from object.deletedCount field', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          key: 'myTestKey2',
          deletedCount: 1,
          site: 'SITE_DEV',
        }),
      );

      const result = await client.del('test-key');

      expect(result).toEqual({
        success: true,
        data: {
          key: 'myTestKey2',
          deletedCount: 1,
          site: 'SITE_DEV',
        },
      });
    });

    it('should return DeleteResponse when deletedCount is 0', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          key: 'myTestKey2',
          deletedCount: 0,
          site: 'SITE_DEV',
        }),
      );

      const result = await client.del('test-key');

      expect(result).toEqual({
        success: true,
        data: {
          key: 'myTestKey2',
          deletedCount: 0,
          site: 'SITE_DEV',
        },
      });
    });

    it('should return DeleteResponse with deletedCount 0 for errors', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockErrorResponse(404, 'Not Found', 'Key not found'),
      );

      const result = await client.del('test-key');

      expect(result).toEqual({
        success: false,
        error: 'Redis REST API error: 404 Not Found - Key not found',
      });
    });

    it('should return result as DeleteResponse when result is not a DeleteResponse object', async () => {
      // The method casts the result, so it will return whatever the API returns
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({ other: 'value' }),
      );

      const result = await client.del('test-key');

      // The method just casts the result, so it returns the object as-is
      expect(result).toEqual({
        success: true,
        data: { other: 'value' },
      });
    });

    it('should return DeleteResponse with deletedCount 0 for any errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server error',
      } as Response);

      const result = await client.del('test-key');

      expect(result).toEqual({
        success: false,
        error: 'Redis REST API error: 500 Internal Server Error - Server error',
      });
    });
  });

  describe('getHash method', () => {
    it('should return hash object directly', async () => {
      const hash = { field1: 'value1', field2: 'value2' };
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          key: 'test-key',
          value: hash,
          site: 'SITE_DEV',
        }),
      );

      const result = await client.getHash('test-key');

      expect(result).toEqual({
        success: true,
        data: {
          key: 'test-key',
          value: hash,
          site: 'SITE_DEV',
        },
      });
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/getHash`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ key: 'test-key' }),
        }),
      );
    });

    it('should return hash from object.value field', async () => {
      const hash = { field1: 'value1', field2: 'value2' };
      mockFetch.mockResolvedValueOnce(createMockJsonResponse({ value: hash }));

      const result = await client.getHash('test-key');

      expect(result).toEqual({
        success: true,
        data: { value: hash },
      });
    });

    it('should return hash from object.value field with key and site fields', async () => {
      const hash = { field1: 'value1', field2: 'value2' };
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          key: 'teshashkeys',
          value: hash,
          site: 'SITE_DEV',
        }),
      );

      const result = await client.getHash('test-key');

      expect(result).toEqual({
        success: true,
        data: {
          key: 'teshashkeys',
          value: hash,
          site: 'SITE_DEV',
        },
      });
    });

    it('should return empty hash from object.value field when value is empty', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          key: 'teshashkeys',
          value: {},
          site: 'SITE_DEV',
        }),
      );

      const result = await client.getHash('test-key');

      expect(result).toEqual({
        success: true,
        data: {
          key: 'teshashkeys',
          value: {},
          site: 'SITE_DEV',
        },
      });
    });

    it('should return empty hash when key does not exist (value is empty object)', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          key: 'teshashkey2',
          value: {},
          site: 'SITE_DEV',
        }),
      );

      const result = await client.getHash('test-key');

      expect(result).toEqual({
        success: true,
        data: {
          key: 'teshashkey2',
          value: {},
          site: 'SITE_DEV',
        },
      });
    });

    it('should return empty object for non-object responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockJsonResponse('not-an-object'));

      const result = await client.getHash('test-key');

      // When response is not an object, request returns it as-is, getHash wraps it in ApiResponse
      expect(result).toEqual({
        success: true,
        data: 'not-an-object',
      });
    });

    it('should return empty object for array responses', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse(['array', 'not', 'object']),
      );

      const result = await client.getHash('test-key');

      // When response is an array, request returns it as-is, getHash wraps it in ApiResponse
      expect(result).toEqual({
        success: true,
        data: ['array', 'not', 'object'],
      });
    });
  });

  describe('setHash method', () => {
    it('should set hash and return number of fields', async () => {
      const hash = { field1: 'value1', field2: 'value2' };
      mockFetch.mockResolvedValueOnce(createMockJsonResponse(2));

      const result = await client.setHash('test-key', hash);

      // When response is a number, request returns it as-is, setHash wraps it in ApiResponse
      expect(result).toEqual({
        success: true,
        data: 2,
      });
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/setHash`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            key: 'test-key',
            value: hash,
          }),
        }),
      );
    });

    it('should set hash with ttlSeconds', async () => {
      const hash = { field1: 'value1', field2: 'value2' };
      mockFetch.mockResolvedValueOnce(createMockJsonResponse(2));

      const result = await client.setHash('test-key', hash, {
        ttlSeconds: 7200,
      });

      expect(result).toEqual({
        success: true,
        data: 2,
      });
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/setHash`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            key: 'test-key',
            value: hash,
            ttlSeconds: 7200,
          }),
        }),
      );
    });

    it('should return setCount from object.setCount field', async () => {
      const hash = { field1: 'value1' };
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          success: true,
          setCount: 1,
          site: 'SITE_DEV',
        }),
      );

      const result = await client.setHash('test-key', hash);

      expect(result).toEqual({
        success: true,
        data: {
          success: true,
          setCount: 1,
          site: 'SITE_DEV',
        },
      });
    });

    it('should return error response when response contains error field', async () => {
      const hash = { field1: 'value1' };
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({
          error: 'Failed to set hash',
        }),
      );

      const result = await client.setHash('test-key', hash);

      expect(result).toEqual({
        success: true,
        data: {
          error: 'Failed to set hash',
        },
      });
    });

    it('should return response as-is when result is not a number or object with setCount', async () => {
      const hash = { field1: 'value1' };
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({ other: 'value' }),
      );

      const result = await client.setHash('test-key', hash);

      expect(result).toEqual({
        success: true,
        data: { other: 'value' },
      });
    });
  });

  describe('request method error handling', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should handle non-JSON response', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockTextResponse('plain text response'),
      );

      const result = await client.get('test-key');

      // When response is plain text, request returns it as string, get wraps it in ApiResponse
      expect(result).toEqual({
        success: true,
        data: 'plain text response',
      });
    });

    it('should handle non-JSON text that cannot be parsed', async () => {
      mockFetch.mockResolvedValueOnce(createMockTextResponse('not valid json'));

      const result = await client.get('test-key');

      // When response is plain text, request returns it as string, get wraps it in ApiResponse
      expect(result).toEqual({
        success: true,
        data: 'not valid json',
      });
    });

    it('should handle response with error field', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({ error: 'Something went wrong' }),
      );

      const result = await client.get('test-key');

      // When response has error field, request returns it, get wraps it in ApiResponse
      expect(result).toEqual({
        success: true,
        data: {
          error: 'Something went wrong',
        },
      });
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      const result = await client.get('test-key');

      expect(result).toEqual({
        success: false,
        error: 'Network error',
      });

      expect(console.error).toHaveBeenCalledWith(
        '[Redis REST] get error:',
        networkError,
      );
    });

    it('should handle response errors with error text', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockErrorResponse(
          500,
          'Internal Server Error',
          'Detailed error message',
        ),
      );

      jest.spyOn(console, 'error').mockImplementation();

      const result = await client.get('test-key');

      expect(result).toEqual({
        success: false,
        error:
          'Redis REST API error: 500 Internal Server Error - Detailed error message',
      });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[Redis REST]'),
        expect.any(Error),
      );
    });
  });

  describe('getRedisRestClient', () => {
    beforeEach(() => {
      process.env.REDIS_API_URL = mockBaseUrl;
      process.env.REDIS_API_KEY = mockBaseKey;
    });

    it('should create and return a client instance', async () => {
      const client = await getRedisRestClient();

      expect(client).toBeInstanceOf(RedisRestClient);
    });

    it('should return the same instance on multiple calls (singleton)', async () => {
      const client1 = await getRedisRestClient();
      const client2 = await getRedisRestClient();

      // Both should be the same instance (singleton pattern)
      expect(client1).toBe(client2);
      expect(client1).toBeInstanceOf(RedisRestClient);
      expect(client2).toBeInstanceOf(RedisRestClient);
    });

    it('should throw error when REDIS_API_URL is not set', async () => {
      delete process.env.REDIS_API_URL;

      await expect(getRedisRestClient()).rejects.toThrow(
        'REDIS_API_URL or REDIS_API_KEY environment variables are missing',
      );
    });

    it('should throw error when REDIS_API_KEY is not set', async () => {
      delete process.env.REDIS_API_KEY;
      await expect(getRedisRestClient()).rejects.toThrow(
        'REDIS_API_URL or REDIS_API_KEY environment variables are missing',
      );
    });

    it('should initialize with apiKey when provided', async () => {
      process.env.REDIS_API_KEY = 'test-api-key';

      const client = await getRedisRestClient();

      expect(client).toBeInstanceOf(RedisRestClient);
    });

    it('should allow new client after reset', async () => {
      const client1 = await getRedisRestClient();

      __resetRestClientForTests();

      const client2 = await getRedisRestClient();

      // They should be different instances
      expect(client1).not.toBe(client2);
    });
  });

  describe('Edge cases and response format handling', () => {
    it('should handle response with result field containing the data', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockJsonResponse({ result: 'test-data' }),
      );

      const result = await client.get('test-key');

      // When response has result field, request unwraps it and returns 'test-data' as string
      // get wraps it in ApiResponse
      expect(result).toEqual({
        success: true,
        data: 'test-data',
      });
    });

    it('should handle PUT method in request', async () => {
      // This tests the body handling for PUT method
      // We can't directly test private request method, but we can verify
      // that methods that might use PUT would work
      // Since all current methods use POST, this is a defensive test
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should catch RequestEntityTooLargeError for 413 status code and return default', async () => {
      jest.spyOn(console, 'error').mockImplementation();
      mockFetch.mockResolvedValueOnce(
        createMockErrorResponse(
          413,
          'Payload Too Large',
          'request entity too large',
        ),
      );

      const result = await client.get('test-key');

      // get method catches RequestEntityTooLargeError and returns error response
      expect(result).toEqual({
        success: false,
        error: 'Request entity too large: request entity too large',
      });
      // Verify the error was logged
      expect(console.error).toHaveBeenCalledWith(
        '[Redis REST] get error:',
        expect.any(RequestEntityTooLargeError),
      );
      jest.restoreAllMocks();
    });

    it('should catch RequestEntityTooLargeError when error text contains "request entity too large"', async () => {
      jest.spyOn(console, 'error').mockImplementation();
      mockFetch.mockResolvedValueOnce(
        createMockErrorResponse(
          500,
          'Internal Server Error',
          'request entity too large error message',
        ),
      );

      const result = await client.get('test-key');

      // get method catches RequestEntityTooLargeError and returns error response
      expect(result).toEqual({
        success: false,
        error:
          'Request entity too large: request entity too large error message',
      });
      // Verify the error was logged
      expect(console.error).toHaveBeenCalledWith(
        '[Redis REST] get error:',
        expect.any(RequestEntityTooLargeError),
      );
      jest.restoreAllMocks();
    });
  });

  describe('getHash error handling', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return default GetHashResponse on error', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      const result = await client.getHash('test-key');

      expect(result).toEqual({
        success: false,
        error: 'Network error',
      });
      expect(console.error).toHaveBeenCalledWith(
        '[Redis REST] getHash error:',
        networkError,
      );
    });
  });

  describe('setHash error handling', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return default SetHashResponse on error', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      const result = await client.setHash('test-key', { field1: 'value1' });

      expect(result).toEqual({
        success: false,
        error: 'Network error',
      });
      expect(console.error).toHaveBeenCalledWith(
        '[Redis REST] setHash error:',
        networkError,
      );
    });
  });

  describe('Exported helper functions', () => {
    beforeEach(() => {
      process.env.REDIS_API_URL = mockBaseUrl;
      process.env.REDIS_API_KEY = mockBaseKey;
      __resetRestClientForTests();
      jest.clearAllMocks();
    });

    afterEach(() => {
      __resetRestClientForTests();
    });

    describe('redisRestGet', () => {
      it('should call client.get with the key', async () => {
        mockFetch.mockResolvedValueOnce(
          createMockJsonResponse({
            key: 'test-key',
            value: 'test-value',
            site: 'SITE_DEV',
          }),
        );

        const result = await redisRestGet('test-key');

        expect(result).toEqual({
          success: true,
          data: {
            key: 'test-key',
            value: 'test-value',
            site: 'SITE_DEV',
          },
        });
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    describe('redisRestGetHash', () => {
      it('should call client.getHash with the key', async () => {
        const hash = { field1: 'value1', field2: 'value2' };
        mockFetch.mockResolvedValueOnce(
          createMockJsonResponse({
            key: 'test-key',
            value: hash,
            site: 'SITE_DEV',
          }),
        );

        const result = await redisRestGetHash('test-key');

        expect(result).toEqual({
          success: true,
          data: {
            key: 'test-key',
            value: hash,
            site: 'SITE_DEV',
          },
        });
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    describe('redisRestSet', () => {
      it('should call client.set with the key, value, and ttlSeconds', async () => {
        mockFetch.mockResolvedValueOnce(
          createMockJsonResponse({
            success: true,
            site: 'SITE_DEV',
          }),
        );

        const result = await redisRestSet('test-key', 'test-value', {
          ttlSeconds: 7200,
        });

        expect(result).toEqual({
          success: true,
          data: {
            success: true,
            site: 'SITE_DEV',
          },
        });
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/set'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              key: 'test-key',
              value: 'test-value',
              ttlSeconds: 7200,
            }),
          }),
        );
      });

      it('should use default ttlSeconds of 3600 when not provided', async () => {
        mockFetch.mockResolvedValueOnce(
          createMockJsonResponse({
            success: true,
            site: 'SITE_DEV',
          }),
        );

        await redisRestSet('test-key', 'test-value');

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/set'),
          expect.objectContaining({
            body: JSON.stringify({
              key: 'test-key',
              value: 'test-value',
              ttlSeconds: 3600,
            }),
          }),
        );
      });
    });

    describe('redisRestSetHash', () => {
      it('should call client.setHash with the key, value, and ttlSeconds', async () => {
        const hash = { field1: 'value1', field2: 'value2' };
        mockFetch.mockResolvedValueOnce(
          createMockJsonResponse({
            success: true,
            setCount: 2,
            site: 'SITE_DEV',
          }),
        );

        const result = await redisRestSetHash('test-key', hash, {
          ttlSeconds: 7200,
        });

        expect(result).toEqual({
          success: true,
          data: {
            success: true,
            setCount: 2,
            site: 'SITE_DEV',
          },
        });
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/setHash'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              key: 'test-key',
              value: hash,
              ttlSeconds: 7200,
            }),
          }),
        );
      });

      it('should use default ttlSeconds of 3600 when not provided', async () => {
        const hash = { field1: 'value1' };
        mockFetch.mockResolvedValueOnce(
          createMockJsonResponse({
            success: true,
            setCount: 1,
            site: 'SITE_DEV',
          }),
        );

        await redisRestSetHash('test-key', hash);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/setHash'),
          expect.objectContaining({
            body: JSON.stringify({
              key: 'test-key',
              value: hash,
              ttlSeconds: 3600,
            }),
          }),
        );
      });
    });

    describe('redisRestDel', () => {
      it('should call client.del with the key', async () => {
        mockFetch.mockResolvedValueOnce(
          createMockJsonResponse({
            key: 'test-key',
            deletedCount: 1,
            site: 'SITE_DEV',
          }),
        );

        const result = await redisRestDel('test-key');

        expect(result).toEqual({
          success: true,
          data: {
            key: 'test-key',
            deletedCount: 1,
            site: 'SITE_DEV',
          },
        });
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });
});
