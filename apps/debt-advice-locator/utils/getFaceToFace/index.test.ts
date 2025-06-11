import getOrganisations, { LIMIT, MAX_RESULTS } from './index';

jest.mock('@googlemaps/google-maps-services-js', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        geocode: jest.fn().mockResolvedValue({
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
        }),
      };
    }),
  };
});

jest.mock('../../public/json/organisations-face-to-face.json', () => [
  { id: 1, name: 'Org 1' },
  { id: 2, name: 'Org 2' },
]);

jest.mock('../../public/json/organisations-lng-lat.json', () => [
  { id: 1, lat: 51.5074, lng: -0.1278 },
  { id: 2, lat: 51.5075, lng: -0.1279 },
]);

describe('getOrganisations', () => {
  it('should return filtered organisations based on search and limit', async () => {
    const result = await getOrganisations('London', '2');
    expect(result.providers.length).toBe(2);
    expect(result.location).toEqual({ lat: 51.5074, lng: -0.1278 });
  });

  it('should limit the results to MAX_RESULTS if limit exceeds MAX_RESULTS', async () => {
    const result = await getOrganisations(
      'London',
      (MAX_RESULTS + 10).toString(),
    );
    expect(result.providers.length).toBeLessThanOrEqual(MAX_RESULTS);
  });

  it('should return a limited number of providers based on the limit parameter', async () => {
    const result = await getOrganisations('London', LIMIT.toString());
    expect(result.providers.length).toBeLessThanOrEqual(LIMIT);
  });
});
