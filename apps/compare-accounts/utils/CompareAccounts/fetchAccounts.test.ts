import { fetchAccounts } from './fetchAccounts';

type WithCause = Error & {
  cause?: { error: unknown };
};

describe('fetchAccounts', () => {
  const mockFetch = jest.fn();
  const URL = 'https://blob.example/accounts/data.json';

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
  });

  const withResponse = (
    response:
      | { ok: boolean; status?: number; json?: () => Promise<unknown> }
      | Error,
  ) => {
    mockFetch.mockImplementation((url: string) => {
      return Promise.resolve(response);
    });
  };

  const mockPayload = {
    'jcr:lastModified': '2026-07-10T09:00:00.040Z',
    items: [
      {
        providerName: 'Item 1',
      },
    ],
  };

  it('returns account data on happy path', async () => {
    withResponse({ ok: true, json: () => Promise.resolve(mockPayload) });

    const result = await fetchAccounts(URL);

    expect(result.data.items).toHaveLength(1);
    expect(result.data.items[0].providerName).toBe('Item 1');
    expect(result.data.lastModified).toBe('2026-07-10T09:00:00.040Z');
    expect(mockFetch).toHaveBeenCalledWith(URL);
  });

  it('throws when payload is missing lastModified', async () => {
    withResponse({ ok: true, json: () => Promise.resolve({ items: [] }) });

    const err = (await fetchAccounts(URL).catch(
      (e: unknown) => e,
    )) as WithCause;

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Failed to fetch accounts');
    expect((err.cause?.error as Error).message).toBe(
      'Blob storage returned malformed payload',
    );
  });

  it('throws when payload items is not an array', async () => {
    withResponse({
      ok: true,
      json: () => Promise.resolve({ items: undefined }),
    });

    const err = (await fetchAccounts(URL).catch(
      (e: unknown) => e,
    )) as WithCause;

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Failed to fetch accounts');
    expect((err.cause?.error as Error).message).toBe(
      'Blob storage returned malformed payload',
    );
  });

  it('throws when service is unavailable', async () => {
    withResponse({ ok: false, status: 503 });

    const err = (await fetchAccounts(URL).catch(
      (e: unknown) => e,
    )) as WithCause;

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Failed to fetch accounts');
    expect((err.cause?.error as Error).message).toBe(
      'Blob storage returned 503',
    );
  });
});
