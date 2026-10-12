import fetchMock from 'jest-fetch-mock';
import { withFetchLock } from './withFetchLock';

describe('withFetchLock', () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  it('should return the result of the fetch function', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }), {
      status: 200,
    });

    const mockFetch = () => fetch('https://example.com');

    const result = await withFetchLock('testKey', mockFetch);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    expect(await result.json()).toEqual({ success: true });
  });

  it('should return the same promise if a request is in progress', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }), {
      status: 200,
    });

    const mockFetch = () => fetch('https://example.com');

    const firstCall = withFetchLock('testKey', mockFetch);
    const secondCall = withFetchLock('testKey', mockFetch);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [result1, result2] = await Promise.all([firstCall, secondCall]);
    expect(result1).toBe(result2);
  });

  it('should release the lock after the request is complete', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }), {
      status: 200,
    });

    const mockFetch = () => fetch('https://example.com');

    await withFetchLock('testKey', mockFetch);
    await withFetchLock('testKey', mockFetch);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('should return errors to the handler when the lock is released', async () => {
    fetchMock.mockResponseOnce('Fetch failed', { status: 500 });

    const mockFetch = () => fetch('https://example.com');

    const result = await withFetchLock('testKey', mockFetch);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(500);
  });

  it('should handle concurrent errors and propagate them correctly', async () => {
    fetchMock.mockResponseOnce('Fetch failed', { status: 500 });

    const mockFetch = () => fetch('https://example.com');

    const firstCall = withFetchLock('testKey', mockFetch);
    const secondCall = withFetchLock('testKey', mockFetch);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [result1, result2] = await Promise.all([firstCall, secondCall]);
    expect(result1).toBe(result2);
  });
});
