import type { GetServerSidePropsContext } from 'next';

import fuelFinderGetServerSideProps, {
  FuelFinderPageProps,
} from './fuelFinderGetServerSideProps';

const mockStationsData = {
  fetchedAt: '2025-01-15T10:00:00Z',
  stations: [
    {
      node_id: 'station-1',
      trading_name: 'Test Station',
      brand_name: null,
      public_phone_number: null,
      is_same_trading_and_brand_name: true,
      location: {
        latitude: 51.5,
        longitude: -0.12,
        address_line_1: '1 Test St',
        address_line_2: null,
        city: 'London',
        country: 'England',
        county: null,
        postcode: 'SW1A 1AA',
      },
      amenities: [],
      opening_times: { usual_days: {} },
      fuel_types: ['E10'],
      temporary_closure: false,
      permanent_closure: false,
      permanent_closure_date: null,
      is_motorway_service_station: false,
      is_supermarket_service_station: false,
      fuel_prices: [
        {
          fuel_type: 'E10',
          price: 130,
          price_last_updated: '2025-01-15T10:00:00Z',
          price_change_effective_timestamp: '2025-01-15T10:00:00Z',
        },
      ],
    },
  ],
};

const mockAppConfig = {
  configurationSettings: [] as Array<{ key: string; value: string }>,
  featureFlags: [],
  dateFetched: '',
};

const mockFetch = jest.fn();

beforeEach(() => {
  mockAppConfig.configurationSettings = [];
  mockFetch.mockReset();
  mockFetch.mockImplementation((url: string) => {
    if (url.endsWith('/api/appconfig')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAppConfig),
      });
    }
    if (url.endsWith('/api/fuel-stations')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockStationsData),
      });
    }
    return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
  });
  global.fetch = mockFetch as unknown as typeof fetch;
});

const DEFAULT_PARAMS = { language: 'en' };

function createContext(
  query: Record<string, string | undefined>,
  params: Record<string, string> = DEFAULT_PARAMS,
): GetServerSidePropsContext {
  return {
    query,
    params,
    req: {
      headers: {
        host: 'localhost:4391',
      },
    },
    res: {},
    resolvedUrl: '/',
  } as unknown as GetServerSidePropsContext;
}

describe('fuelFinderGetServerSideProps', () => {
  it('redirects to landing page when no coordinates provided', async () => {
    const result = await fuelFinderGetServerSideProps(createContext({}));
    expect(result).toEqual({
      redirect: { destination: '/en', permanent: false },
    });
  });

  it('redirects to correct language landing page', async () => {
    const result = await fuelFinderGetServerSideProps(
      createContext({}, { language: 'cy' }),
    );
    expect(result).toEqual({
      redirect: { destination: '/cy', permanent: false },
    });
  });

  it('redirects when only postcode provided without coordinates', async () => {
    const result = await fuelFinderGetServerSideProps(
      createContext({ postcode: 'SW1A 1AA' }),
    );
    expect(result).toEqual({
      redirect: { destination: '/en', permanent: false },
    });
  });

  it('fetches stations via internal API route', async () => {
    await fuelFinderGetServerSideProps(
      createContext({ lat: '51.5', lng: '-0.12', radius: '50' }),
    );
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4391/api/fuel-stations',
    );
  });

  it('returns results when lat/lng provided', async () => {
    const result = await fuelFinderGetServerSideProps(
      createContext({ lat: '51.5', lng: '-0.12', radius: '50' }),
    );
    const { props } = result as { props: FuelFinderPageProps };
    expect(props.hasSearched).toBe(true);
    expect(props.totalItems).toBeGreaterThan(0);
  });

  it('sets isEmbed from query', async () => {
    const result = await fuelFinderGetServerSideProps(
      createContext({ isEmbedded: 'true', lat: '51.5', lng: '-0.12' }),
    );
    const { props } = result as { props: FuelFinderPageProps };
    expect(props.isEmbed).toBe(true);
  });

  it('returns null emergencyBannerContent when app config has no banner', async () => {
    const result = await fuelFinderGetServerSideProps(
      createContext({ lat: '51.5', lng: '-0.12' }),
    );
    const { props } = result as { props: FuelFinderPageProps };
    expect(props.emergencyBannerContent).toBeNull();
  });

  it('returns parsed emergencyBannerContent when app config has valid banner', async () => {
    mockAppConfig.configurationSettings = [
      {
        key: 'emergency-banner',
        value: JSON.stringify({
          en: 'Service disruption',
          cy: 'Aflonyddwch gwasanaeth',
          variant: 'warning',
        }),
      },
    ];
    const result = await fuelFinderGetServerSideProps(
      createContext({ lat: '51.5', lng: '-0.12' }),
    );
    const { props } = result as { props: FuelFinderPageProps };
    expect(props.emergencyBannerContent).toEqual({
      en: 'Service disruption',
      cy: 'Aflonyddwch gwasanaeth',
      variant: 'warning',
    });
  });

  it('fetches app config via internal API route', async () => {
    await fuelFinderGetServerSideProps(
      createContext({ lat: '51.5', lng: '-0.12' }),
    );
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4391/api/appconfig',
    );
  });
});
