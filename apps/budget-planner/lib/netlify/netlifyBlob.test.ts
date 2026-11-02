import { fetchDataFromCache, saveDataToCache } from './netlifyBlob';

describe('fetchDataFromCache', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    (global as any).fetch = jest.fn();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should call the correct endpoint with the provided key', async () => {
    const key = 'myKey';
    const mockJson = { data: 'testData' };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: {
        get: jest.fn().mockReturnValue('application/json'),
      },
      json: jest.fn().mockResolvedValue(mockJson),
    });

    const result = await fetchDataFromCache<typeof mockJson>(key);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        '/.netlify/functions/fetchDataFromBlob?key=myKey',
      ),
      {
        method: 'GET',
      },
    );
    expect(result).toEqual(mockJson);
  });

  it('should encode the key in the query parameter', async () => {
    const key = 'my Key with spaces';
    const mockJson = { data: 'testData' };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: {
        get: jest.fn().mockReturnValue('application/json'),
      },
      json: jest.fn().mockResolvedValue(mockJson),
    });

    await fetchDataFromCache(key);

    // The key should be URL-encoded
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        '/.netlify/functions/fetchDataFromBlob?key=my%20Key%20with%20spaces',
      ),
      expect.any(Object),
    );
  });

  it('should throw an error if the response is not ok', async () => {
    const key = 'faultyKey';
    const mockErrorText = 'Not Found';

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      text: jest.fn().mockResolvedValue(mockErrorText),
    });

    await expect(fetchDataFromCache(key)).rejects.toThrow(
      `Netlify Functions request failed (404): ${mockErrorText}`,
    );
  });

  it('should return text if content-type is not JSON', async () => {
    const key = 'textKey';
    const mockText = 'Plain Text Response';

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: {
        get: jest.fn().mockReturnValue('text/plain'),
      },
      text: jest.fn().mockResolvedValue(mockText),
    });

    const result = await fetchDataFromCache<string>(key);
    expect(result).toEqual(mockText);
  });
});

describe('saveDataToCache', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    (global as any).fetch = jest.fn();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should call the correct endpoint and return JSON on success', async () => {
    const queryData = { foo: 'bar' };
    const cacheName = 'myCache';
    const mockResult = { success: true };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: { get: jest.fn().mockReturnValue('application/json') },
      json: jest.fn().mockResolvedValue(mockResult),
    });

    const result = await saveDataToCache(queryData, cacheName);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/.netlify/functions/saveDataToBlob'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryData, cacheName }),
      },
    );
    expect(result).toEqual(mockResult);
  });

  it('should throw an error if response is not ok', async () => {
    const queryData = { foo: 'bar' };
    const cacheName = 'myCache';
    const mockErrorText = 'An error occurred';

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue(mockErrorText),
    });

    await expect(saveDataToCache(queryData, cacheName)).rejects.toThrow(
      `Netlify Functions request failed (500): ${mockErrorText}`,
    );
  });

  it('should handle text response if content-type is not JSON', async () => {
    const queryData = { foo: 'bar' };
    const cacheName = 'myCache';
    const mockText = 'Saved Successfully';

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: { get: jest.fn().mockReturnValue('text/plain') },
      text: jest.fn().mockResolvedValue(mockText),
    });

    const result = await saveDataToCache(queryData, cacheName);
    expect(result).toEqual(mockText);
  });
});
