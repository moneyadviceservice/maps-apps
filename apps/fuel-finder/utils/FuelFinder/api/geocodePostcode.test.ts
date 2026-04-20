import { geocodePostcode } from './geocodePostcode';

describe('geocodePostcode', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
  });

  it('returns coordinates for a valid postcode', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          result: {
            latitude: 51.5014,
            longitude: -0.1419,
            postcode: 'SW1A 1AA',
          },
        }),
    });

    const result = await geocodePostcode('SW1A 1AA');
    expect(result).toEqual({
      latitude: 51.5014,
      longitude: -0.1419,
      postcode: 'SW1A 1AA',
    });
  });

  it('returns null for invalid postcode', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
    });

    const result = await geocodePostcode('INVALID');
    expect(result).toBeNull();
  });

  it('returns null when API returns no result', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: null }),
    });

    const result = await geocodePostcode('ZZ99 9ZZ');
    expect(result).toBeNull();
  });

  it('returns null on network error', async () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    mockFetch.mockRejectedValue(new Error('Network error'));

    const result = await geocodePostcode('SW1A 1AA');
    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
      'geocodePostcode failed:',
      expect.any(Error),
    );

    errorSpy.mockRestore();
  });

  it('returns null when result has non-numeric coordinates', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          result: { latitude: null, longitude: -0.1, postcode: 'SW1A 1AA' },
        }),
    });

    const result = await geocodePostcode('SW1A 1AA');
    expect(result).toBeNull();
  });

  it('trims whitespace from postcode', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          result: { latitude: 51.5, longitude: -0.1, postcode: 'SW1A 1AA' },
        }),
    });

    await geocodePostcode('  SW1A 1AA  ');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('SW1A%201AA'),
    );
  });
});
