import {
  cosmosCreateSession,
  cosmosDeleteSession,
  cosmosGetSession,
  cosmosPatchSession,
  cosmosReplaceSession,
} from './rest-client';

const mockFetch = jest.fn();

const mockResponse = (text: string, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: String(status),
    text: async () => text,
  } as Response);

const jsonResponse = (body: unknown) => mockResponse(JSON.stringify(body));

describe('cosmos rest-client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    global.fetch = mockFetch;
    mockFetch.mockReset();
    process.env = {
      ...originalEnv,
      COSMOS_API_URL: 'https://cosmos.test/',
      COSMOS_API_KEY: 'key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('returns an error response when env vars are missing', async () => {
    delete process.env.COSMOS_API_KEY;
    const result = await cosmosGetSession('abc');
    expect(result.error).toContain('COSMOS_API_URL or COSMOS_API_KEY');
    expect(result.status).toBeUndefined();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it.each([
    ['POST', () => cosmosCreateSession('s 1', { a: 1 }), true],
    ['GET', () => cosmosGetSession('s 1'), false],
    ['PUT', () => cosmosReplaceSession('s 1', { a: 1 }), true],
    ['PATCH', () => cosmosPatchSession('s 1', { a: 1 }), true],
    ['DELETE', () => cosmosDeleteSession('s 1'), false],
  ])('%s sends the correct request', async (method, call, hasBody) => {
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));

    const result = await call();

    expect(result).toEqual({ status: 200, data: { ok: true } });
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://cosmos.test/api/s%201');
    expect(init.method).toBe(method);
    expect(init.headers['x-api-key']).toBe('key');
    expect(init.body).toBe(hasBody ? JSON.stringify({ a: 1 }) : undefined);
  });

  it('handles empty responses', async () => {
    mockFetch.mockResolvedValue(mockResponse('', 204));
    expect(await cosmosDeleteSession('abc')).toEqual({
      status: 204,
      data: undefined,
    });
  });

  it('uses the message field of an error body', async () => {
    mockFetch.mockResolvedValue(
      mockResponse(
        JSON.stringify({ message: 'No session found for this sessionId.' }),
        404,
      ),
    );
    expect(await cosmosGetSession('abc')).toEqual({
      status: 404,
      error:
        'Cosmos REST API error: 404 - No session found for this sessionId.',
    });
  });

  it('uses the error field of an authentication error body', async () => {
    mockFetch.mockResolvedValue(
      mockResponse(JSON.stringify({ error: 'Invalid API key' }), 403),
    );
    const result = await cosmosGetSession('abc');
    expect(result.status).toBe(403);
    expect(result.error).toContain('Invalid API key');
  });

  it('reports 409 when the session already exists', async () => {
    mockFetch.mockResolvedValue(
      mockResponse(JSON.stringify({ message: 'exists' }), 409),
    );
    const result = await cosmosCreateSession('abc', {});
    expect(result.status).toBe(409);
  });

  it('falls back to plain text error bodies', async () => {
    mockFetch.mockResolvedValue(mockResponse('Bad Gateway', 503));
    const result = await cosmosGetSession('abc');
    expect(result.error).toBe('Cosmos REST API error: 503 - Bad Gateway');
  });

  it('has no status when the request fails to complete', async () => {
    mockFetch.mockRejectedValue(new Error('network down'));
    expect(await cosmosGetSession('abc')).toEqual({
      status: undefined,
      error: 'network down',
    });
  });
});
