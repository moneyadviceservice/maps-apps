import { executeGraphBatchRequest } from './graphBatchExecutor';

const mockFetch = jest.fn();
global.fetch = mockFetch;

interface MockGraphBatchRequest {
  id: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
}

interface MockGraphBatchResponseItem {
  id: string;
  status: number;
  headers: Record<string, string>;
  body?: unknown;
}

describe('executeGraphBatchRequest', () => {
  const mockToken = 'mock-auth-token';
  const mockEndpoint = 'https://graph.microsoft.com/v1.0/$batch';
  const commonHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${mockToken}`,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute a batch request and return sorted responses on success', async () => {
    const batchRequests: MockGraphBatchRequest[] = [
      { id: '2', method: 'GET', url: '/users/user2' },
      { id: '1', method: 'GET', url: '/users/user1' },
    ];
    const mockResponses: MockGraphBatchResponseItem[] = [
      { id: '1', status: 200, headers: {}, body: { id: 'user1-id' } },
      { id: '2', status: 200, headers: {}, body: { id: 'user2-id' } },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          responses: [mockResponses[1], mockResponses[0]],
        }),
    });

    const result = await executeGraphBatchRequest(mockToken, batchRequests);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(mockEndpoint, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({ requests: batchRequests }),
    });
    expect(result).toEqual(mockResponses);
  });

  it('should throw an error if the overall batch request is not ok', async () => {
    const errorDetail = { error: 'Service Unavailable' };
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(errorDetail),
    });

    const batchRequests: MockGraphBatchRequest[] = [
      { id: '1', method: 'GET', url: '/users/user1' },
    ];

    await expect(
      executeGraphBatchRequest(mockToken, batchRequests),
    ).rejects.toThrow(
      `Graph batch request failed: ${JSON.stringify(errorDetail)}`,
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should re-throw an error if fetch itself fails', async () => {
    const networkError = new Error('Network timeout');
    mockFetch.mockRejectedValueOnce(networkError);

    const batchRequests: MockGraphBatchRequest[] = [
      { id: '1', method: 'GET', url: '/users/user1' },
    ];

    await expect(
      executeGraphBatchRequest(mockToken, batchRequests),
    ).rejects.toThrow(networkError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle an unknown error type thrown by fetch', async () => {
    mockFetch.mockRejectedValueOnce('Some non-Error object');

    const batchRequests: MockGraphBatchRequest[] = [
      { id: '1', method: 'GET', url: '/users/user1' },
    ];

    await expect(
      executeGraphBatchRequest(mockToken, batchRequests),
    ).rejects.toThrow('Unknown error during batch execution');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle batch with no individual requests', async () => {
    const batchRequests: MockGraphBatchRequest[] = [];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ responses: [] }),
    });

    const result = await executeGraphBatchRequest(mockToken, batchRequests);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      mockEndpoint,
      expect.objectContaining({
        body: JSON.stringify({ requests: [] }),
      }),
    );
    expect(result).toEqual([]);
  });
});
