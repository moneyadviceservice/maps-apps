describe('getOrganisations', () => {
  let getOrganisations: any;
  let LIMIT: number;
  let MAX_RESULTS: number;
  let mockGeocode: jest.MockedFunction<any>;

  beforeAll(() => {
    jest.doMock('../../public/json/organisations-face-to-face.json', () => [
      { id: 1, name: 'Org 1', address: 'Address 1' },
      { id: 2, name: 'Org 2', address: 'Address 2' },
      { id: 3, name: 'Org 3', address: 'Address 3' },
      { id: 4, name: 'Org 4', address: 'Address 4' },
      { id: 5, name: 'Org 5', address: 'Address 5' },
    ]);
    jest.doMock('../../public/json/organisations-lng-lat.json', () => [
      { id: 1, lat: 51.5074, lng: -0.1278 }, // London - closest
      { id: 2, lat: 51.5075, lng: -0.1279 }, // Very close to London
      { id: 3, lat: 52.4862, lng: -1.8904 }, // Birmingham - further
      { id: 4, lat: 53.4808, lng: -2.2426 }, // Manchester - even further
      { id: 5, lat: 55.9533, lng: -3.1883 }, // Edinburgh - furthest
      { id: 999, lat: 51.4545, lng: -2.5879 }, // Bath - has location but no face-to-face org
    ]);

    mockGeocode = jest.fn();

    jest.doMock('@googlemaps/google-maps-services-js', () => ({
      Client: jest.fn().mockImplementation(() => ({
        geocode: mockGeocode,
      })),
    }));

    const module = require('./index');
    getOrganisations = module.default;
    LIMIT = module.LIMIT;
    MAX_RESULTS = module.MAX_RESULTS;
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
              short_name: 'London',
              long_name: 'London',
              types: ['locality', 'political'],
            },
            {
              short_name: 'GB',
              long_name: 'United Kingdom',
              types: ['country', 'political'],
            },
          ],
          geometry: {
            location: {
              lat: 51.5074,
              lng: -0.1278,
            },
          },
        },
      ],
    },
  };

  const mockGeocodeNonUK = {
    data: {
      results: [
        {
          address_components: [
            {
              short_name: 'Paris',
              long_name: 'Paris',
              types: ['locality', 'political'],
            },
            {
              short_name: 'FR',
              long_name: 'France',
              types: ['country', 'political'],
            },
          ],
          geometry: {
            location: {
              lat: 48.8566,
              lng: 2.3522,
            },
          },
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_GEO_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    delete process.env.GOOGLE_GEO_API_KEY;
  });

  it('should return filtered organisations based on search and limit for UK locations', async () => {
    mockGeocode.mockResolvedValue(mockGeocodeUK);
    const result = await getOrganisations('London', '2');

    expect(result.location).toEqual({ lat: 51.5074, lng: -0.1278 });
  });

  it('should limit the results to MAX_RESULTS if limit exceeds MAX_RESULTS', async () => {
    mockGeocode.mockResolvedValue(mockGeocodeUK);
    const result = await getOrganisations(
      'London',
      (MAX_RESULTS + 10).toString(),
    );
    expect(result.providers.length).toBeLessThanOrEqual(MAX_RESULTS);
  });

  it('should return a limited number of providers based on the limit parameter', async () => {
    mockGeocode.mockResolvedValue(mockGeocodeUK);
    const result = await getOrganisations('London', LIMIT.toString());
    expect(result.providers.length).toBeLessThanOrEqual(LIMIT);
  });

  it('should return empty results for non-UK locations', async () => {
    mockGeocode.mockResolvedValue(mockGeocodeNonUK);
    const result = await getOrganisations('Paris', '2');
    expect(result.providers).toEqual([]);
    expect(result.location).toEqual({ lat: 0, lng: 0 });
  });

  it('should return empty results when no geocoding results found', async () => {
    mockGeocode.mockResolvedValue({ data: { results: [] } });
    const result = await getOrganisations('InvalidLocation', '2');
    expect(result.providers).toEqual([]);
    expect(result.location).toEqual({ lat: 0, lng: 0 });
  });

  it('should use provided location when loc parameter is passed', async () => {
    const customLocation = { lat: 52.4862, lng: -1.8904 }; // Birmingham
    const result = await getOrganisations('Birmingham', '3', customLocation);

    expect(result.location).toEqual(customLocation);
    expect(mockGeocode).not.toHaveBeenCalled();
  });

  it('should handle Google Maps API errors gracefully', async () => {
    mockGeocode.mockRejectedValue(new Error('API Error'));
    const result = await getOrganisations('London', '2');

    expect(result.providers).toEqual([]);
    expect(result.location).toEqual({ lat: 0, lng: 0 });
  });

  it('should return providers sorted by distance from closest to furthest', async () => {
    mockGeocode.mockResolvedValue(mockGeocodeUK);
    const result = await getOrganisations('London', '5');

    expect(result.providers.length).toBeGreaterThanOrEqual(2);

    if (result.providers.length > 1) {
      const distances = result.providers.map((p: any) =>
        Number.parseFloat(p.distance as string),
      );
      for (let i = 1; i < distances.length; i++) {
        expect(distances[i]).toBeGreaterThanOrEqual(distances[i - 1]);
      }
    }
  });

  it('should handle limit parameter as string "0" correctly', async () => {
    mockGeocode.mockResolvedValue(mockGeocodeUK);
    const result = await getOrganisations('London', '0');

    expect(result.providers).toEqual([]);
    expect(result.location).toEqual({ lat: 51.5074, lng: -0.1278 });
  });

  it('should handle limit parameter as string "1" correctly', async () => {
    mockGeocode.mockResolvedValue(mockGeocodeUK);
    const result = await getOrganisations('London', '1');

    expect(result.providers.length).toBeLessThanOrEqual(1);
    expect(result.location).toEqual({ lat: 51.5074, lng: -0.1278 });
  });

  it('should handle geocoding result without address_components', async () => {
    const mockGeocodeNoComponents = {
      data: {
        results: [
          {
            geometry: {
              location: {
                lat: 51.5074,
                lng: -0.1278,
              },
            },
          },
        ],
      },
    };

    mockGeocode.mockResolvedValue(mockGeocodeNoComponents);
    const result = await getOrganisations('London', '2');

    expect(result.providers).toEqual([]);
    expect(result.location).toEqual({ lat: 0, lng: 0 });
  });

  it('should handle geocoding result with empty address_components', async () => {
    const mockGeocodeEmptyComponents = {
      data: {
        results: [
          {
            address_components: [],
            geometry: {
              location: {
                lat: 51.5074,
                lng: -0.1278,
              },
            },
          },
        ],
      },
    };

    mockGeocode.mockResolvedValue(mockGeocodeEmptyComponents);
    const result = await getOrganisations('London', '2');

    expect(result.providers).toEqual([]);
    expect(result.location).toEqual({ lat: 0, lng: 0 });
  });

  it('should handle geocoding result with country component but not GB', async () => {
    const mockGeocodeOtherCountry = {
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
              location: {
                lat: 40.7128,
                lng: -74.006,
              },
            },
          },
        ],
      },
    };

    mockGeocode.mockResolvedValue(mockGeocodeOtherCountry);
    const result = await getOrganisations('New York', '2');

    expect(result.providers).toEqual([]);
    expect(result.location).toEqual({ lat: 0, lng: 0 });
  });

  it('should handle very large limit numbers correctly', async () => {
    mockGeocode.mockResolvedValue(mockGeocodeUK);
    const result = await getOrganisations('London', '999999');

    expect(result.providers.length).toBeLessThanOrEqual(MAX_RESULTS);
  });

  it('should handle negative limit numbers correctly', async () => {
    mockGeocode.mockResolvedValue(mockGeocodeUK);
    const result = await getOrganisations('London', '-5');

    expect(result.providers).toEqual([]);
  });

  it('should filter out locations that have no corresponding face-to-face organization', async () => {
    mockGeocode.mockResolvedValue(mockGeocodeUK);
    const result = await getOrganisations('London', '10'); // Request more than available

    // Should return only the providers that exist in both lng-lat and face-to-face data
    // ID 999 exists in lng-lat but not in face-to-face, so should be filtered out
    const providerIds = result.providers.map((p: any) => Number(p.id));
    expect(providerIds).not.toContain(999);
    expect(result.providers.length).toBe(5); // Should have 5 valid providers (IDs 1-5)
  });

  describe('Constants', () => {
    it('should export correct LIMIT constant', () => {
      expect(LIMIT).toBe(8);
    });

    it('should export correct MAX_RESULTS constant', () => {
      expect(MAX_RESULTS).toBe(32);
    });
  });
});
