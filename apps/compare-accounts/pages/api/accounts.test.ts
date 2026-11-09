import { NextApiRequest, NextApiResponse } from 'next';

import handler from './accounts';

describe('accounts API handler', () => {
  const mockFetch = jest.fn();
  const URL = 'https://blob.example/accounts/data.json';
  const originalEnvAccounts = process.env.ACCOUNTS_API;

  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  const makeRes = (): Partial<NextApiResponse> => {
    const r: Partial<NextApiResponse> = {};
    r.status = jest.fn().mockReturnValue(r);
    r.json = jest.fn().mockReturnValue(r);
    r.setHeader = jest.fn().mockReturnValue(r);
    return r;
  };

  type MockResponse = {
    ok: boolean;
    status?: number;
    json?: () => Promise<unknown>;
  };

  const withResponse = (responses: Record<string, MockResponse | Error>) => {
    mockFetch.mockImplementation((url: string) => {
      const result = responses[url];
      if (!result) {
        return Promise.reject(new Error(`Unexpected fetch to ${url}`));
      }
      if (result instanceof Error) {
        return Promise.reject(result);
      }
      return Promise.resolve(result);
    });
  };

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
    process.env.ACCOUNTS_API = URL;
    res = makeRes();
  });

  afterAll(() => {
    process.env.ACCOUNTS_API = originalEnvAccounts;
  });

  it('returns 405 for non-GET requests', async () => {
    req = { method: 'POST' };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 500 when ACCOUNTS_API is not set', async () => {
    delete process.env.ACCOUNTS_API;
    req = { method: 'GET' };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'ACCOUNTS_API is not set',
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 502 when blob storage respond non-OK', async () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    req = { method: 'GET' };
    withResponse({
      [URL]: { ok: false, status: 503 },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to fetch accounts',
    });
    expect(errorSpy).toHaveBeenCalledWith(
      'accounts handler failed:',
      expect.objectContaining({
        message: 'Failed to fetch accounts',
        cause: expect.objectContaining({
          error: expect.any(Error),
        }),
      }),
    );

    errorSpy.mockRestore();
  });

  it('returns 502 when both compact and fallback throw on fetch', async () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    req = { method: 'GET' };
    withResponse({
      [URL]: new Error('Network down'),
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to fetch accounts',
    });

    errorSpy.mockRestore();
  });

  it('returns 502 when both payloads are malformed', async () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    req = { method: 'GET' };
    withResponse({
      [URL]: {
        ok: true,
        json: () => Promise.resolve({ accounts: 'not-an-array' }),
      },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to fetch accounts',
    });

    errorSpy.mockRestore();
  });

  it('returns 200 with compact payload and sets cache header to 3 hours', async () => {
    jest.useFakeTimers();
    try {
      // 10:00 -> next refresh at 10:38 -> 2280 seconds.
      jest.setSystemTime(new Date('2026-04-14T10:00:00.000Z'));

      req = { method: 'GET' };
      const allDay: [string, string, boolean][] = Array.from(
        { length: 7 },
        () => ['00:00:00', '00:00:00', true],
      );
      const responseBlob = {
        'jcr:lastModified': '2026-04-07T10:00:00Z',
        items: [
          {
            providerName: 'Item 1',
          },
        ],
      };
      withResponse({
        [URL]: { ok: true, json: () => Promise.resolve(responseBlob) },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Netlify-CDN-Cache-Control',
        'public, durable, s-maxage=10800, stale-while-revalidate=60',
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(URL);
    } finally {
      jest.useRealTimers();
    }
  });
});
