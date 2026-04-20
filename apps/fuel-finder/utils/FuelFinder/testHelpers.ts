import { useRouter } from 'next/router';

import type { StationSearchResult } from './types';

export const mockedUseRouter = useRouter as jest.Mock;

type RouterReturnValue = Partial<ReturnType<typeof useRouter>>;

const defaultRouter = () => ({
  push: jest.fn(),
  query: { language: 'en' },
  asPath: '/en/fuel-finder',
});

export const setupUseRouter = (overrides: RouterReturnValue = {}) => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue({
      ...defaultRouter(),
      ...overrides,
    });
  });
};

export const setupFakeTimers = () => {
  beforeAll(() => {
    jest
      .useFakeTimers({ doNotFake: ['setTimeout'] })
      .setSystemTime(new Date('2025-06-04T12:00:00Z'));
  });
  afterAll(() => {
    jest.useRealTimers();
  });
};

export function createTestStation(
  overrides: Partial<StationSearchResult> = {},
): StationSearchResult {
  return {
    node_id: 'test-node-001',
    trading_name: 'Test Fuel Station',
    brand_name: 'Test Brand',
    public_phone_number: '01234 567890',
    is_same_trading_and_brand_name: false,
    location: {
      latitude: 51.5074,
      longitude: -0.1278,
      address_line_1: '123 Test Street',
      address_line_2: null,
      city: 'London',
      country: 'England',
      county: 'Greater London',
      postcode: 'SW1A 1AA',
    },
    amenities: ['car_wash', 'customer_toilets'],
    opening_times: {
      usual_days: {
        monday: { open: '06:00', close: '22:00', is_24_hours: false },
        tuesday: { open: '06:00', close: '22:00', is_24_hours: false },
        wednesday: { open: '06:00', close: '22:00', is_24_hours: false },
        thursday: { open: '06:00', close: '22:00', is_24_hours: false },
        friday: { open: '06:00', close: '22:00', is_24_hours: false },
        saturday: { open: '07:00', close: '21:00', is_24_hours: false },
        sunday: { open: '08:00', close: '20:00', is_24_hours: false },
      },
    },
    fuel_types: ['E10', 'E5', 'B7_STANDARD'],
    temporary_closure: false,
    permanent_closure: false,
    permanent_closure_date: null,
    is_motorway_service_station: false,
    is_supermarket_service_station: false,
    fuel_prices: [
      {
        fuel_type: 'E10',
        price: 132.9,
        price_last_updated: '2025-01-15T10:00:00Z',
        price_change_effective_timestamp: '2025-01-15T10:00:00Z',
      },
      {
        fuel_type: 'E5',
        price: 140.9,
        price_last_updated: '2025-01-15T10:00:00Z',
        price_change_effective_timestamp: '2025-01-15T10:00:00Z',
      },
      {
        fuel_type: 'B7_STANDARD',
        price: 138.9,
        price_last_updated: '2025-01-15T10:00:00Z',
        price_change_effective_timestamp: '2025-01-15T10:00:00Z',
      },
    ],
    distance: 1.5,
    ...overrides,
  };
}
