import { NextApiRequest, NextApiResponse } from 'next';

import handler from './fuel-stations';

describe('fuel-stations API handler', () => {
  const mockFetch = jest.fn();
  const originalEnv = process.env.STATIONS_BLOB_URL;

  const BASE_URL = 'https://blob.example/stations/';
  const COMPACT_URL = `${BASE_URL}stations.compact.json.br`;
  const FALLBACK_URL = `${BASE_URL}stations.json.gz`;

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

  const routeFetch = (responses: Record<string, MockResponse | Error>) => {
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
    process.env.STATIONS_BLOB_URL = BASE_URL;
    res = makeRes();
  });

  afterAll(() => {
    process.env.STATIONS_BLOB_URL = originalEnv;
  });

  it('returns 405 for non-GET requests', async () => {
    req = { method: 'POST' };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 500 when STATIONS_BLOB_URL is not set', async () => {
    delete process.env.STATIONS_BLOB_URL;
    req = { method: 'GET' };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'STATIONS_BLOB_URL is not set',
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 502 when both compact and fallback respond non-OK', async () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    req = { method: 'GET' };
    routeFetch({
      [COMPACT_URL]: { ok: false, status: 503 },
      [FALLBACK_URL]: { ok: false, status: 503 },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to fetch stations',
    });
    expect(errorSpy).toHaveBeenCalledWith(
      'fuel-stations handler failed:',
      expect.objectContaining({
        compact: expect.any(Error),
        fallback: expect.any(Error),
      }),
    );

    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('returns 502 when both compact and fallback throw on fetch', async () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    req = { method: 'GET' };
    routeFetch({
      [COMPACT_URL]: new Error('Network down'),
      [FALLBACK_URL]: new Error('Network down'),
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to fetch stations',
    });

    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('returns 502 when both payloads are malformed', async () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    req = { method: 'GET' };
    routeFetch({
      [COMPACT_URL]: {
        ok: true,
        json: () => Promise.resolve({ stations: 'not-an-array' }),
      },
      [FALLBACK_URL]: {
        ok: true,
        json: () => Promise.resolve({ stations: 'not-an-array' }),
      },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to fetch stations',
    });

    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('returns 200 with compact payload and sets cache header synced to next :38', async () => {
    jest.useFakeTimers();
    try {
      // 10:00 -> next refresh at 10:38 -> 2280 seconds.
      jest.setSystemTime(new Date('2026-04-14T10:00:00.000Z'));

      req = { method: 'GET' };
      const allDay: [string, string, boolean][] = Array.from(
        { length: 7 },
        () => ['00:00:00', '00:00:00', true],
      );
      const compact = {
        v: 1,
        f: '2026-04-07T10:00:00Z',
        _b: [],
        _ci: [],
        _cn: [],
        _co: [],
        _ot: [[allDay, null]],
        s: [
          [
            'station-1',
            'A Station',
            null,
            null,
            0,
            'Main St',
            null,
            null,
            null,
            null,
            'SW1A 1AA',
            51.5,
            -0.14,
            0,
            0,
            0,
            [],
          ],
        ],
      };
      routeFetch({
        [COMPACT_URL]: { ok: true, json: () => Promise.resolve(compact) },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Netlify-CDN-Cache-Control',
        'public, durable, s-maxage=2280, stale-while-revalidate=60',
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(COMPACT_URL);
    } finally {
      jest.useRealTimers();
    }
  });

  it('rolls cache window to next hour when current time is past :38', async () => {
    jest.useFakeTimers();
    try {
      // 10:40 -> next refresh at 11:38 -> 58 minutes = 3480 seconds.
      jest.setSystemTime(new Date('2026-04-14T10:40:00.000Z'));

      req = { method: 'GET' };
      routeFetch({
        [COMPACT_URL]: {
          ok: true,
          json: () =>
            Promise.resolve({
              v: 1,
              f: '2026-04-07T10:00:00Z',
              _b: [],
              _ci: [],
              _cn: [],
              _co: [],
              _ot: [],
              s: [],
            }),
        },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Netlify-CDN-Cache-Control',
        'public, durable, s-maxage=3480, stale-while-revalidate=60',
      );
    } finally {
      jest.useRealTimers();
    }
  });

  it('decodes a compact payload and returns the verbose shape', async () => {
    req = { method: 'GET' };
    const allDay: [string, string, boolean][] = Array.from(
      { length: 7 },
      () => ['00:00:00', '00:00:00', true],
    );
    const compact = {
      v: 1,
      f: '2026-04-16T10:00:00',
      _b: ['Shell'],
      _ci: ['London'],
      _cn: [],
      _co: ['England'],
      _ot: [[allDay, null]],
      s: [
        [
          '4882e3fee979',
          'Compact Station',
          0, // brand Shell
          null,
          0, // no flags
          'Main St',
          null,
          0, // city London
          0, // country England
          null, // county null
          'SW1A 1AA',
          51.5,
          -0.14,
          0, // no amenities
          0, // opening times idx
          1, // fuel_types: E10
          [[0, 145.9, '2026-04-15T10:00:00Z']],
        ],
      ],
    };
    routeFetch({
      [COMPACT_URL]: { ok: true, json: () => Promise.resolve(compact) },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        fetchedAt: '2026-04-16T10:00:00',
        stations: expect.arrayContaining([
          expect.objectContaining({
            node_id: '4882e3fee979',
            trading_name: 'Compact Station',
            brand_name: 'Shell',
            fuel_types: ['E10'],
          }),
        ]),
      }),
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('falls back to gzipped verbose file when compact responds non-OK', async () => {
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    req = { method: 'GET' };
    const verbose = {
      fetchedAt: '2026-04-16T10:00:00Z',
      stations: [{ node_id: 'fallback-1' }],
    };
    routeFetch({
      [COMPACT_URL]: { ok: false, status: 404 },
      [FALLBACK_URL]: { ok: true, json: () => Promise.resolve(verbose) },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(verbose);
    expect(mockFetch).toHaveBeenNthCalledWith(1, COMPACT_URL);
    expect(mockFetch).toHaveBeenNthCalledWith(2, FALLBACK_URL);
    expect(warnSpy).toHaveBeenCalledWith(
      'fuel-stations: compact fetch/decode failed, trying fallback:',
      expect.any(Error),
    );

    warnSpy.mockRestore();
  });

  it('falls back to gzipped verbose file when compact fetch throws', async () => {
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    req = { method: 'GET' };
    const verbose = {
      fetchedAt: '2026-04-16T10:00:00Z',
      stations: [{ node_id: 'fallback-2' }],
    };
    routeFetch({
      [COMPACT_URL]: new Error('Network down'),
      [FALLBACK_URL]: { ok: true, json: () => Promise.resolve(verbose) },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(verbose);

    warnSpy.mockRestore();
  });

  it('falls back to gzipped verbose file when compact decode throws', async () => {
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    req = { method: 'GET' };
    const verbose = {
      fetchedAt: '2026-04-16T10:00:00Z',
      stations: [{ node_id: 'fallback-3' }],
    };
    routeFetch({
      [COMPACT_URL]: {
        ok: true,
        json: () =>
          Promise.resolve({
            v: 99,
            f: '2026-04-16T10:00:00',
            _b: [],
            _ci: [],
            _cn: [],
            _co: [],
            _ot: [],
            s: [],
          }),
      },
      [FALLBACK_URL]: { ok: true, json: () => Promise.resolve(verbose) },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(verbose);

    warnSpy.mockRestore();
  });
});
