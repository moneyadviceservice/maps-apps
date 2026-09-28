import { fetchStationsWithFallback } from './fetchStations';

type WithCause = Error & {
  cause?: { compact: unknown; fallback: unknown };
};

describe('fetchStations', () => {
  const mockFetch = jest.fn();
  const BASE_URL = 'https://blob.example/stations/';
  const COMPACT_URL = `${BASE_URL}stations.compact.json.br`;
  const FALLBACK_URL = `${BASE_URL}stations.json.gz`;

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
  });

  describe('fetchStationsWithFallback', () => {
    const allDay: [string, string, boolean][] = Array.from(
      { length: 7 },
      () => ['00:00:00', '00:00:00', true],
    );
    const compactPayload = {
      v: 1,
      f: '2026-04-16T10:00:00Z',
      _b: ['Shell'],
      _ci: [],
      _cn: [],
      _co: [],
      _ot: [[allDay, null]],
      s: [
        [
          'node-1',
          'Test',
          0,
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
          1,
          [[0, 145.9, '2026-04-15T10:00:00Z']],
        ],
      ],
    };
    const verbosePayload = {
      fetchedAt: '2026-04-16T10:00:00Z',
      stations: [{ node_id: 'verbose-1' }],
    };

    const routeFetch = (
      compact:
        | { ok: boolean; status?: number; json?: () => Promise<unknown> }
        | Error,
      fallback?:
        | { ok: boolean; status?: number; json?: () => Promise<unknown> }
        | Error,
    ) => {
      mockFetch.mockImplementation((url: string) => {
        const target = url === COMPACT_URL ? compact : fallback;
        if (!target) {
          return Promise.reject(new Error(`Unexpected fetch to ${url}`));
        }
        if (target instanceof Error) return Promise.reject(target);
        return Promise.resolve(target);
      });
    };

    it('returns compact result with source="compact" on happy path', async () => {
      routeFetch({ ok: true, json: () => Promise.resolve(compactPayload) });

      const result = await fetchStationsWithFallback(BASE_URL);

      expect(result.source).toBe('compact');
      expect(result.compactError).toBeUndefined();
      expect(result.version).toBe(1);
      expect(result.data.stations).toHaveLength(1);
      expect(result.data.stations[0].brand_name).toBe('Shell');
      expect(result.data.fetchedAt).toBe('2026-04-16T10:00:00Z');
      expect(mockFetch).toHaveBeenCalledWith(COMPACT_URL);
      expect(mockFetch).not.toHaveBeenCalledWith(FALLBACK_URL);
    });

    it('falls back to verbose when compact fetch rejects', async () => {
      routeFetch(new Error('Network down'), {
        ok: true,
        json: () => Promise.resolve(verbosePayload),
      });

      const result = await fetchStationsWithFallback(BASE_URL);

      expect(result.source).toBe('fallback');
      expect(result.compactError).toEqual(expect.any(Error));
      expect(result.version).toBeNull();
      expect(result.data).toEqual(verbosePayload);
    });

    it('falls back to verbose when compact response is not OK', async () => {
      routeFetch(
        { ok: false, status: 404 },
        { ok: true, json: () => Promise.resolve(verbosePayload) },
      );

      const result = await fetchStationsWithFallback(BASE_URL);

      expect(result.source).toBe('fallback');
      expect(result.compactError).toEqual(
        expect.objectContaining({ message: 'Blob storage returned 404' }),
      );
    });

    it('falls back to verbose when compact payload has unsupported version', async () => {
      routeFetch(
        {
          ok: true,
          json: () =>
            Promise.resolve({
              v: 99,
              f: '2026-04-16T10:00:00Z',
              _b: [],
              _ci: [],
              _cn: [],
              _co: [],
              _ot: [],
              s: [],
            }),
        },
        { ok: true, json: () => Promise.resolve(verbosePayload) },
      );

      const result = await fetchStationsWithFallback(BASE_URL);

      expect(result.source).toBe('fallback');
      expect(result.version).toBeNull();
    });

    it('throws with cause carrying both errors when both sources fail', async () => {
      routeFetch({ ok: false, status: 500 }, { ok: false, status: 503 });

      const err = (await fetchStationsWithFallback(BASE_URL).catch(
        (e: unknown) => e,
      )) as WithCause;

      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Failed to fetch stations');
      expect((err.cause?.compact as Error).message).toBe(
        'Blob storage returned 500',
      );
      expect((err.cause?.fallback as Error).message).toBe(
        'Blob storage returned 503',
      );
    });

    it('throws when fallback payload is missing fetchedAt', async () => {
      routeFetch(new Error('Network down'), {
        ok: true,
        json: () => Promise.resolve({ stations: [] }),
      });

      const err = (await fetchStationsWithFallback(BASE_URL).catch(
        (e: unknown) => e,
      )) as WithCause;

      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Failed to fetch stations');
      expect((err.cause?.fallback as Error).message).toBe(
        'Blob storage returned malformed payload',
      );
    });

    it('throws when fallback stations field is not an array', async () => {
      routeFetch(new Error('Network down'), {
        ok: true,
        json: () =>
          Promise.resolve({
            fetchedAt: '2026-04-16T10:00:00Z',
            stations: 'not-an-array',
          }),
      });

      const err = (await fetchStationsWithFallback(BASE_URL).catch(
        (e: unknown) => e,
      )) as WithCause;

      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Failed to fetch stations');
      expect((err.cause?.fallback as Error).message).toBe(
        'Blob storage returned malformed payload',
      );
    });
  });

  describe('SAS token handling', () => {
    const SAS_TOKEN = 'sv=2022-11-02&ss=b&srt=co&sp=r&sig=AbCd%2BEf%3D';
    const compactPayload = {
      v: 1,
      f: '2026-04-16T10:00:00Z',
      _b: [],
      _ci: [],
      _cn: [],
      _co: [],
      _ot: [],
      s: [],
    };

    const captureUrls = (response: {
      ok: boolean;
      json?: () => Promise<unknown>;
    }) => {
      const calls: string[] = [];
      mockFetch.mockImplementation((url: string) => {
        calls.push(url);
        return Promise.resolve(response);
      });
      return calls;
    };

    it('appends SAS token without leading "?" to file URL', async () => {
      const calls = captureUrls({
        ok: true,
        json: () => Promise.resolve(compactPayload),
      });

      await fetchStationsWithFallback(BASE_URL, SAS_TOKEN);

      expect(calls).toEqual([`${COMPACT_URL}?${SAS_TOKEN}`]);
    });

    it('appends SAS token that already has a leading "?"', async () => {
      const calls = captureUrls({
        ok: true,
        json: () => Promise.resolve(compactPayload),
      });

      await fetchStationsWithFallback(BASE_URL, `?${SAS_TOKEN}`);

      expect(calls).toEqual([`${COMPACT_URL}?${SAS_TOKEN}`]);
    });

    it('preserves pre-encoded characters in SAS signature byte-for-byte', async () => {
      const tricky = 'sv=2022-11-02&sig=Ab%2BCd%2FEf%3D%3D';
      const calls = captureUrls({
        ok: true,
        json: () => Promise.resolve(compactPayload),
      });

      await fetchStationsWithFallback(BASE_URL, tricky);

      expect(calls[0]).toBe(`${COMPACT_URL}?${tricky}`);
      expect(calls[0]).not.toContain('%252B');
      expect(calls[0]).not.toContain('%252F');
      expect(calls[0]).not.toContain('%253D');
    });

    it('omits query string when SAS token is undefined', async () => {
      const calls = captureUrls({
        ok: true,
        json: () => Promise.resolve(compactPayload),
      });

      await fetchStationsWithFallback(BASE_URL);

      expect(calls).toEqual([COMPACT_URL]);
    });

    it('omits query string when SAS token is empty string', async () => {
      const calls = captureUrls({
        ok: true,
        json: () => Promise.resolve(compactPayload),
      });

      await fetchStationsWithFallback(BASE_URL, '');

      expect(calls).toEqual([COMPACT_URL]);
    });

    it('omits query string when SAS token is whitespace only', async () => {
      const calls = captureUrls({
        ok: true,
        json: () => Promise.resolve(compactPayload),
      });

      await fetchStationsWithFallback(BASE_URL, '   ');

      expect(calls).toEqual([COMPACT_URL]);
    });

    it('appends SAS token to fallback URL when compact fails', async () => {
      const verbosePayload = {
        fetchedAt: '2026-04-16T10:00:00Z',
        stations: [{ node_id: 'fallback-1' }],
      };
      const calls: string[] = [];
      mockFetch.mockImplementation((url: string) => {
        calls.push(url);
        if (url.startsWith(COMPACT_URL)) {
          return Promise.resolve({ ok: false, status: 404 });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(verbosePayload),
        });
      });

      await fetchStationsWithFallback(BASE_URL, SAS_TOKEN);

      expect(calls).toEqual([
        `${COMPACT_URL}?${SAS_TOKEN}`,
        `${FALLBACK_URL}?${SAS_TOKEN}`,
      ]);
    });
  });
});
