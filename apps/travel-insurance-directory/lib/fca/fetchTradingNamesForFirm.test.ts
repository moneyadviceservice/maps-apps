import {
  extractTradingNamesFromFcaNamesResponse,
  fetchTradingNamesForFirmFcaNumber,
  getNextFcaNamesPageUrl,
} from './fetchTradingNamesForFirm';
import { mockJsonFetchResponse } from './testing/mockJsonFetchResponse';

const FCA_ROOT = 'https://register.fca.org.uk/services/V0.1';
const FRN = 999004;
const firmNamesUrl = `${FCA_ROOT}/Firm/${FRN}/Names`;
const firmNamesPage2Url = `${firmNamesUrl}?pgnp=2`;

const FCA_ENV_MISSING_RESULT = {
  ok: false,
  error: 'FCA API env vars missing',
} as const;

describe('fetchTradingNamesForFirm', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = mockFetch;
    process.env.FCA_API_BASE_URL = FCA_ROOT;
    process.env.FCA_API_KEY = 'key';
    process.env.FCA_API_EMAIL = 'e@example.com';
  });

  describe('extractTradingNamesFromFcaNamesResponse', () => {
    it('returns only Trading status names from Current Names', () => {
      const names = extractTradingNamesFromFcaNamesResponse({
        Data: [
          {
            'Current Names': [
              { Name: 'Alpha Trade', Status: 'Trading' },
              { Name: 'Beta Brand', Status: 'Registered' },
              { Name: 'Gamma Trade', Status: 'Trading' },
            ],
          },
        ],
      });
      expect(names).toEqual(['Alpha Trade', 'Gamma Trade']);
    });

    it('returns empty array when Data or Current Names missing', () => {
      expect(extractTradingNamesFromFcaNamesResponse({})).toEqual([]);
      expect(extractTradingNamesFromFcaNamesResponse({ Data: [{}] })).toEqual(
        [],
      );
    });

    it('treats non-Trading Status values as excluded', () => {
      expect(
        extractTradingNamesFromFcaNamesResponse({
          Data: [
            {
              'Current Names': [
                { Name: 'X', Status: 123 as unknown as string },
                { Name: 'Y', Status: 'Trading' },
              ],
            },
          ],
        }),
      ).toEqual(['Y']);
    });

    it('includes Trading rows with missing Name as empty string', () => {
      expect(
        extractTradingNamesFromFcaNamesResponse({
          Data: [{ 'Current Names': [{ Status: 'Trading' }] }],
        }),
      ).toEqual(['']);
    });

    it('handles sparse / invalid entries in Current Names', () => {
      expect(
        extractTradingNamesFromFcaNamesResponse({
          Data: [
            {
              'Current Names': [
                undefined as never,
                { Name: 'Keep', Status: 'Trading' },
              ],
            },
          ],
        }),
      ).toEqual(['Keep']);
    });
  });

  describe('getNextFcaNamesPageUrl', () => {
    it('returns trimmed Next URL when present', () => {
      expect(
        getNextFcaNamesPageUrl({
          ResultInfo: {
            Next: `  ${firmNamesPage2Url}  `,
          },
        }),
      ).toBe(firmNamesPage2Url);
    });

    it.each([
      [{}],
      [{ ResultInfo: { Next: '' } }],
      [{ ResultInfo: { Next: null as unknown as string } }],
      [{ ResultInfo: { Next: '   ' } }],
      [{ ResultInfo: { Next: 42 as unknown as string } }],
    ])('returns null when Next is absent or invalid (%#)', (payload) => {
      expect(getNextFcaNamesPageUrl(payload as never)).toBeNull();
    });
  });

  describe('fetchTradingNamesForFirmFcaNumber', () => {
    it.each(['FCA_API_BASE_URL', 'FCA_API_KEY', 'FCA_API_EMAIL'] as const)(
      'returns error when %s is missing',
      async (envKey) => {
        delete process.env[envKey];
        const result = await fetchTradingNamesForFirmFcaNumber(FRN);
        expect(result).toEqual(FCA_ENV_MISSING_RESULT);
        expect(mockFetch).not.toHaveBeenCalled();
      },
    );

    const expectSingleFetchWithDefaultHeaders = () => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        firmNamesUrl,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-Auth-Key': 'key',
            'X-Auth-Email': 'e@example.com',
          }),
        }),
      );
    };

    it('drops whitespace-only Trading names when merging pages', async () => {
      mockFetch
        .mockResolvedValueOnce(
          mockJsonFetchResponse({
            ResultInfo: { Next: firmNamesPage2Url },
            Data: [
              {
                'Current Names': [{ Name: '   ', Status: 'Trading' }],
              },
            ],
          }),
        )
        .mockResolvedValueOnce(
          mockJsonFetchResponse({
            Data: [
              {
                'Current Names': [{ Name: 'Real Co', Status: 'Trading' }],
              },
            ],
          }),
        );

      const result = await fetchTradingNamesForFirmFcaNumber(FRN);

      expect(result).toEqual({ ok: true, names: ['Real Co'] });
    });

    it('fetches first page only when ResultInfo.Next is absent', async () => {
      mockFetch.mockResolvedValueOnce(
        mockJsonFetchResponse({
          Status: 'FSR-API-02-04-00',
          Data: [
            {
              'Current Names': [{ Name: 'One', Status: 'Trading' }],
            },
          ],
        }),
      );

      const result = await fetchTradingNamesForFirmFcaNumber(FRN);

      expect(result).toEqual({ ok: true, names: ['One'] });
      expectSingleFetchWithDefaultHeaders();
    });

    it('follows ResultInfo.Next and merges Trading names across pages', async () => {
      mockFetch
        .mockResolvedValueOnce(
          mockJsonFetchResponse({
            ResultInfo: {
              Next: firmNamesPage2Url,
              page: '1',
              per_page: '10',
              total_count: '29',
            },
            Data: [
              {
                'Current Names': [{ Name: 'Page One', Status: 'Trading' }],
              },
            ],
          }),
        )
        .mockResolvedValueOnce(
          mockJsonFetchResponse({
            ResultInfo: {},
            Data: [
              {
                'Current Names': [
                  { Name: 'Page Two A', Status: 'Trading' },
                  { Name: 'Ignored', Status: 'Registered' },
                ],
              },
            ],
          }),
        );

      const result = await fetchTradingNamesForFirmFcaNumber(FRN);

      expect(result).toEqual({
        ok: true,
        names: ['Page One', 'Page Two A'],
      });
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch.mock.calls[1][0]).toBe(firmNamesPage2Url);
    });

    it('dedupes the same Trading name across pages (case-insensitive)', async () => {
      mockFetch
        .mockResolvedValueOnce(
          mockJsonFetchResponse({
            ResultInfo: { Next: firmNamesPage2Url },
            Data: [
              {
                'Current Names': [{ Name: 'Same Co', Status: 'Trading' }],
              },
            ],
          }),
        )
        .mockResolvedValueOnce(
          mockJsonFetchResponse({
            Data: [
              {
                'Current Names': [{ Name: 'same co', Status: 'Trading' }],
              },
            ],
          }),
        );

      const result = await fetchTradingNamesForFirmFcaNumber(FRN);

      expect(result).toEqual({ ok: true, names: ['Same Co'] });
    });

    it.each([
      {
        name: 'first page',
        arrange: () => {
          mockFetch.mockResolvedValueOnce(
            mockJsonFetchResponse({}, false, 503),
          );
        },
        expected: { ok: false as const, error: 'FCA names fetch failed (503)' },
      },
      {
        name: 'follow-up page',
        arrange: () => {
          mockFetch
            .mockResolvedValueOnce(
              mockJsonFetchResponse({
                ResultInfo: { Next: firmNamesPage2Url },
                Data: [
                  {
                    'Current Names': [{ Name: 'A', Status: 'Trading' }],
                  },
                ],
              }),
            )
            .mockResolvedValueOnce(mockJsonFetchResponse({}, false, 500));
        },
        expected: { ok: false as const, error: 'FCA names fetch failed (500)' },
      },
    ])(
      'returns error when $name returns non-OK HTTP status',
      async ({ arrange, expected }) => {
        arrange();
        await expect(fetchTradingNamesForFirmFcaNumber(FRN)).resolves.toEqual(
          expected,
        );
      },
    );

    it.each([
      ['Error', new Error('network down'), 'network down'],
      ['non-Error', 'boom', 'Unknown error'],
    ])(
      'returns error when fetch throws (%s)',
      async (_label, rejection, message) => {
        mockFetch.mockRejectedValueOnce(rejection);

        const result = await fetchTradingNamesForFirmFcaNumber(FRN);

        expect(result).toEqual({ ok: false, error: message });
      },
    );

    it('returns error when response.json fails on HTTP 200', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.reject(new SyntaxError('bad json')),
      });

      const result = await fetchTradingNamesForFirmFcaNumber(FRN);

      expect(result).toEqual({ ok: false, error: 'bad json' });
    });

    it('stops after MAX_NAMES_PAGES when Next never clears', async () => {
      const perpetualNext = `${firmNamesUrl}?pgnp=x`;

      mockFetch.mockImplementation(() =>
        Promise.resolve(
          mockJsonFetchResponse({
            ResultInfo: { Next: perpetualNext },
            Data: [
              {
                'Current Names': [{ Name: 'LoopName', Status: 'Trading' }],
              },
            ],
          }),
        ),
      );

      const result = await fetchTradingNamesForFirmFcaNumber(FRN);

      expect(mockFetch).toHaveBeenCalledTimes(30);
      expect(result).toEqual({ ok: true, names: ['LoopName'] });
    });
  });
});
