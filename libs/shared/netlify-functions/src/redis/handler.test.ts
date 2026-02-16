import {
  redisNetlifyFunctionHandler,
  VALID_OPERATIONS,
  redisNetlifyFunctionConfig,
} from './handler';

// Mock fetch globally
global.fetch = jest.fn();

// Mock Request and Response for Node.js environment
global.Request = jest.fn().mockImplementation((url, options) => ({
  url,
  method: options?.method || 'GET',
  json: jest.fn().mockResolvedValue(JSON.parse(options?.body || '{}')),
  headers: new Headers(options?.headers || {}),
})) as unknown as typeof Request;

global.Response = jest.fn().mockImplementation((body, options) => ({
  json: async () => JSON.parse(body),
  text: async () => body,
  status: options?.status || 200,
  headers: new Headers(options?.headers || {}),
})) as unknown as typeof Response;

// Helper functions to reduce duplication
const createMockFetchResponse = (
  status: number,
  data: unknown,
  contentType = 'application/json',
) => ({
  status,
  text: async () => (typeof data === 'string' ? data : JSON.stringify(data)),
  headers: new Headers({ 'Content-Type': contentType }),
});

const createRequest = (url: string, body?: unknown, method = 'POST'): Request =>
  new Request(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

const withConsoleErrorSpy = (
  testFn: (spy: jest.SpyInstance) => Promise<void>,
) => {
  return async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    try {
      await testFn(consoleErrorSpy);
    } finally {
      consoleErrorSpy.mockRestore();
    }
  };
};

describe('redisNetlifyFunctionHandler', () => {
  const originalEnv = process.env;
  const mockRedisApiUrl = 'https://redis-api.example.com';
  const mockRedisApiKey = 'test-api-key';

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to clean environment
    process.env = {
      ...originalEnv,
      REDIS_API_URL: mockRedisApiUrl,
      REDIS_API_KEY: mockRedisApiKey,
    };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('method validation', () => {
    it('should return 405 for non-POST requests', async () => {
      const request = createRequest(
        'https://example.com/fn/get',
        undefined,
        'GET',
      );

      const response = await redisNetlifyFunctionHandler(request);

      expect(response.status).toBe(405);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('operation extraction', () => {
    it.each(VALID_OPERATIONS)(
      'should extract operation from pathname for %s',
      async (operation) => {
        (global.fetch as jest.Mock).mockResolvedValueOnce(
          createMockFetchResponse(200, { success: true, data: 'test' }),
        );

        const request = createRequest(`https://example.com/fn/${operation}`, {
          key: 'test-key',
        });

        const response = await redisNetlifyFunctionHandler(request);

        expect(response.status).toBe(200);
        expect(global.fetch).toHaveBeenCalledWith(
          `${mockRedisApiUrl}/api/${operation}`,
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'x-api-key': mockRedisApiKey,
            }),
            body: JSON.stringify({ key: 'test-key' }),
          }),
        );
      },
    );

    it('should extract operation from query parameter', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(200, { success: true }),
      );

      const request = createRequest(
        'https://example.com/.netlify/functions/redis?operation=get',
        { key: 'test-key' },
      );

      const response = await redisNetlifyFunctionHandler(request);

      expect(response.status).toBe(200);
      expect(global.fetch).toHaveBeenCalledWith(
        `${mockRedisApiUrl}/api/get`,
        expect.any(Object),
      );
    });

    it('should prefer query parameter over pathname', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(200, { success: true }),
      );

      const request = createRequest(
        'https://example.com/fn/set?operation=get',
        { key: 'test-key' },
      );

      await redisNetlifyFunctionHandler(request);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockRedisApiUrl}/api/get`,
        expect.any(Object),
      );
    });
  });

  describe('error handling', () => {
    it('should return 400 when operation is missing', async () => {
      const request = createRequest('https://example.com/invalid-path', {
        key: 'test-key',
      });

      const response = await redisNetlifyFunctionHandler(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: 'Invalid path format. Expected /fn/{operation}',
      });
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return 400 when operation is invalid', async () => {
      const request = createRequest('https://example.com/fn/invalidOp', {
        key: 'test-key',
      });

      const response = await redisNetlifyFunctionHandler(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: 'Invalid operation: invalidOp',
      });
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return 500 when REDIS_API_URL is missing', async () => {
      delete process.env.REDIS_API_URL;

      const request = createRequest('https://example.com/fn/get', {
        key: 'test-key',
      });

      const response = await redisNetlifyFunctionHandler(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: 'Redis API configuration missing',
      });
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return 500 when REDIS_API_KEY is missing', async () => {
      delete process.env.REDIS_API_KEY;

      const request = createRequest('https://example.com/fn/get', {
        key: 'test-key',
      });

      const response = await redisNetlifyFunctionHandler(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: 'Redis API configuration missing',
      });
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it(
      'should handle fetch errors',
      withConsoleErrorSpy(async (consoleErrorSpy) => {
        const fetchError = new Error('Network error');
        (global.fetch as jest.Mock).mockRejectedValueOnce(fetchError);

        const request = createRequest('https://example.com/fn/get', {
          key: 'test-key',
        });

        const response = await redisNetlifyFunctionHandler(request);
        const responseData = await response.json();

        expect(response.status).toBe(500);
        expect(responseData).toEqual({
          error: 'Network error',
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '[Netlify Redis Proxy] error:',
          fetchError,
        );
      }),
    );

    it(
      'should handle fetch response errors',
      withConsoleErrorSpy(async (consoleErrorSpy) => {
        // Mock a response that throws when text() is called
        const mockResponse = {
          status: 200,
          text: jest
            .fn()
            .mockRejectedValueOnce(new Error('Response read error')),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        };
        (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

        const request = createRequest('https://example.com/fn/get', {
          key: 'test-key',
        });

        const response = await redisNetlifyFunctionHandler(request);
        const responseData = await response.json();

        expect(response.status).toBe(500);
        expect(responseData.error).toBe('Response read error');
        expect(consoleErrorSpy).toHaveBeenCalled();
      }),
    );

    it(
      'should handle JSON parse errors',
      withConsoleErrorSpy(async (consoleErrorSpy) => {
        // Create a request that will fail on json() call
        const request = {
          url: 'https://example.com/fn/get',
          method: 'POST',
          json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
          headers: new Headers(),
        } as unknown as Request;

        const response = await redisNetlifyFunctionHandler(request);
        const responseData = await response.json();

        expect(response.status).toBe(500);
        expect(responseData.error).toBe('Invalid JSON');
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '[Netlify Redis Proxy] error:',
          expect.any(Error),
        );
      }),
    );

    it(
      'should handle non-Error exceptions',
      withConsoleErrorSpy(async (consoleErrorSpy) => {
        // Mock a non-Error exception (e.g., string thrown)
        const nonErrorException = 'String error';
        (global.fetch as jest.Mock).mockRejectedValueOnce(nonErrorException);

        const request = createRequest('https://example.com/fn/get', {
          key: 'test-key',
        });

        const response = await redisNetlifyFunctionHandler(request);
        const responseData = await response.json();

        expect(response.status).toBe(500);
        expect(responseData).toEqual({
          error: 'Unknown error',
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '[Netlify Redis Proxy] error:',
          nonErrorException,
        );
      }),
    );
  });

  describe('response forwarding', () => {
    it('should forward response status code', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(404, { error: 'Not found' }),
      );

      const request = createRequest('https://example.com/fn/get', {
        key: 'test-key',
      });

      const response = await redisNetlifyFunctionHandler(request);

      expect(response.status).toBe(404);
    });

    it('should forward response headers', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(200, 'plain text response', 'text/plain'),
      );

      const request = createRequest('https://example.com/fn/get', {
        key: 'test-key',
      });

      const response = await redisNetlifyFunctionHandler(request);

      expect(response.headers.get('Content-Type')).toBe('text/plain');
    });

    it('should default to application/json when Content-Type is missing', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        text: async () => JSON.stringify({ data: 'test' }),
        headers: new Headers(),
      });

      const request = createRequest('https://example.com/fn/get', {
        key: 'test-key',
      });

      const response = await redisNetlifyFunctionHandler(request);

      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should forward response body', async () => {
      const mockResponseData = { success: true, data: { key: 'value' } };
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(200, mockResponseData),
      );

      const request = createRequest('https://example.com/fn/get', {
        key: 'test-key',
      });

      const response = await redisNetlifyFunctionHandler(request);
      const responseText = await response.text();

      expect(responseText).toBe(JSON.stringify(mockResponseData));
    });
  });

  describe('request forwarding', () => {
    it('should forward request body to Redis API', async () => {
      const requestBody = { key: 'test-key', value: 'test-value' };
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(200, { success: true }),
      );

      const request = createRequest('https://example.com/fn/set', requestBody);

      await redisNetlifyFunctionHandler(request);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(requestBody),
        }),
      );
    });

    it('should include x-api-key header', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(200, { success: true }),
      );

      const request = createRequest('https://example.com/fn/get', {
        key: 'test-key',
      });

      await redisNetlifyFunctionHandler(request);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-api-key': mockRedisApiKey,
          }),
        }),
      );
    });
  });

  describe('config', () => {
    it('should export config with correct paths', () => {
      expect(redisNetlifyFunctionConfig).toEqual({
        path: ['/fn/get', '/fn/set', '/fn/del', '/fn/getHash', '/fn/setHash'],
      });
    });
  });
});
