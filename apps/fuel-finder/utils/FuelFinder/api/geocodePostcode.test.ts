describe('geocodePostcode', () => {
  let geocodePostcode: (postcode: string) => Promise<any>;
  let mockGeocode: jest.MockedFunction<any>;

  beforeAll(() => {
    mockGeocode = jest.fn();

    jest.doMock('@googlemaps/google-maps-services-js', () => ({
      Client: jest.fn().mockImplementation(() => ({
        geocode: mockGeocode,
      })),
    }));

    const module = require('./geocodePostcode');
    geocodePostcode = module.geocodePostcode;
  });

  afterAll(() => {
    jest.resetModules();
  });

  const mockGeocodeUK = {
    data: {
      results: [
        {
          address_components: [
            {
              short_name: 'GB',
              long_name: 'United Kingdom',
              types: ['country', 'political'],
            },
          ],
          geometry: {
            location: {
              lat: 51.5014,
              lng: -0.1419,
            },
          },
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_MAPS_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    delete process.env.GOOGLE_MAPS_API_KEY;
  });

  it('returns coordinates for a valid UK postcode', async () => {
    mockGeocode.mockResolvedValue(mockGeocodeUK);

    const result = await geocodePostcode('SW1A 1AA');
    expect(result).toEqual({
      latitude: 51.5014,
      longitude: -0.1419,
      postcode: 'SW1A 1AA',
    });
  });

  it('returns null for non-UK location', async () => {
    mockGeocode.mockResolvedValue({
      data: {
        results: [
          {
            address_components: [
              {
                short_name: 'FR',
                long_name: 'France',
                types: ['country', 'political'],
              },
            ],
            geometry: {
              location: { lat: 48.8566, lng: 2.3522 },
            },
          },
        ],
      },
    });

    const result = await geocodePostcode('75001');
    expect(result).toBeNull();
  });

  it('returns null when API returns no results', async () => {
    mockGeocode.mockResolvedValue({ data: { results: [] } });

    const result = await geocodePostcode('ZZ99 9ZZ');
    expect(result).toBeNull();
  });

  it('returns null on API error', async () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    mockGeocode.mockRejectedValue(new Error('API Error'));

    const result = await geocodePostcode('SW1A 1AA');
    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
      'geocodePostcode failed:',
      expect.any(Error),
    );

    errorSpy.mockRestore();
  });

  it('returns null when result has no address_components', async () => {
    mockGeocode.mockResolvedValue({
      data: {
        results: [
          {
            geometry: {
              location: { lat: 51.5014, lng: -0.1419 },
            },
          },
        ],
      },
    });

    const result = await geocodePostcode('SW1A 1AA');
    expect(result).toBeNull();
  });

  it('returns null when address_components is empty', async () => {
    mockGeocode.mockResolvedValue({
      data: {
        results: [
          {
            address_components: [],
            geometry: {
              location: { lat: 51.5014, lng: -0.1419 },
            },
          },
        ],
      },
    });

    const result = await geocodePostcode('SW1A 1AA');
    expect(result).toBeNull();
  });

  it('returns null when country is present but not GB', async () => {
    mockGeocode.mockResolvedValue({
      data: {
        results: [
          {
            address_components: [
              {
                short_name: 'US',
                long_name: 'United States',
                types: ['country', 'political'],
              },
            ],
            geometry: {
              location: { lat: 40.7128, lng: -74.006 },
            },
          },
        ],
      },
    });

    const result = await geocodePostcode('10001');
    expect(result).toBeNull();
  });

  it('trims whitespace from postcode', async () => {
    mockGeocode.mockResolvedValue(mockGeocodeUK);

    await geocodePostcode('  SW1A 1AA  ');
    expect(mockGeocode).toHaveBeenCalledWith({
      params: {
        address: 'SW1A 1AA, GB',
        key: 'test-api-key',
      },
    });
  });

  it('passes GOOGLE_MAPS_API_KEY to the client', async () => {
    mockGeocode.mockResolvedValue(mockGeocodeUK);

    await geocodePostcode('SW1A 1AA');
    expect(mockGeocode).toHaveBeenCalledWith({
      params: expect.objectContaining({
        key: 'test-api-key',
      }),
    });
  });
});
