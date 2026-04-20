import { createTestStation } from '../testHelpers';
import type { SearchFilters, Station } from '../types';

import { searchStations } from './searchStations';

const baseFilters: SearchFilters = {
  postcode: '',
  lat: null,
  lng: null,
  fuelTypes: [],
  amenities: [],
  radius: null,
  sort: 'price',
  supermarket: false,
  motorway: false,
  open24h: false,
  searchQuery: '',
  page: 1,
  perPage: 20,
};

const fetchedAt = '2025-01-15T10:00:00Z';

describe('searchStations', () => {
  const stations: Station[] = [
    createTestStation({ node_id: 'open-station', temporary_closure: false }),
    createTestStation({
      node_id: 'closed-station',
      temporary_closure: true,
    }),
    createTestStation({
      node_id: 'perm-closed',
      permanent_closure: true,
    }),
  ];

  it('excludes closed stations', () => {
    const result = searchStations(stations, baseFilters, fetchedAt);
    expect(result.stations).toHaveLength(1);
    expect(result.stations[0].node_id).toBe('open-station');
  });

  it('filters by fuel type', () => {
    const stationsWithFuel = [
      createTestStation({
        node_id: 'has-e10',
        fuel_prices: [
          {
            fuel_type: 'E10',
            price: 130,
            price_last_updated: '',
            price_change_effective_timestamp: '',
          },
        ],
      }),
      createTestStation({
        node_id: 'no-e10',
        fuel_prices: [
          {
            fuel_type: 'B7_STANDARD',
            price: 140,
            price_last_updated: '',
            price_change_effective_timestamp: '',
          },
        ],
      }),
    ];

    const result = searchStations(
      stationsWithFuel,
      { ...baseFilters, fuelTypes: ['E10'] },
      fetchedAt,
    );
    expect(result.stations).toHaveLength(1);
    expect(result.stations[0].node_id).toBe('has-e10');
  });

  it('filters by amenities', () => {
    const stationsWithAmenities = [
      createTestStation({
        node_id: 'has-wash',
        amenities: ['car_wash', 'customer_toilets'],
      }),
      createTestStation({
        node_id: 'no-wash',
        amenities: ['customer_toilets'],
      }),
    ];

    const result = searchStations(
      stationsWithAmenities,
      { ...baseFilters, amenities: ['car_wash'] },
      fetchedAt,
    );
    expect(result.stations).toHaveLength(1);
    expect(result.stations[0].node_id).toBe('has-wash');
  });

  it('filters by supermarket flag', () => {
    const stationsMixed = [
      createTestStation({
        node_id: 'super',
        is_supermarket_service_station: true,
      }),
      createTestStation({
        node_id: 'not-super',
        is_supermarket_service_station: false,
      }),
    ];

    const result = searchStations(
      stationsMixed,
      { ...baseFilters, supermarket: true },
      fetchedAt,
    );
    expect(result.stations).toHaveLength(1);
    expect(result.stations[0].node_id).toBe('super');
  });

  it('filters by search query on trading name', () => {
    const namedStations = [
      createTestStation({ node_id: 'shell', trading_name: 'Shell Express' }),
      createTestStation({ node_id: 'bp', trading_name: 'BP Connect' }),
    ];

    const result = searchStations(
      namedStations,
      { ...baseFilters, searchQuery: 'shell' },
      fetchedAt,
    );
    expect(result.stations).toHaveLength(1);
    expect(result.stations[0].node_id).toBe('shell');
  });

  it('sorts by price when fuel type selected', () => {
    const pricedStations = [
      createTestStation({
        node_id: 'expensive',
        fuel_prices: [
          {
            fuel_type: 'E10',
            price: 150,
            price_last_updated: '',
            price_change_effective_timestamp: '',
          },
        ],
      }),
      createTestStation({
        node_id: 'cheap',
        fuel_prices: [
          {
            fuel_type: 'E10',
            price: 120,
            price_last_updated: '',
            price_change_effective_timestamp: '',
          },
        ],
      }),
    ];

    const result = searchStations(
      pricedStations,
      { ...baseFilters, sort: 'price', fuelTypes: ['E10'] },
      fetchedAt,
    );
    expect(result.stations[0].node_id).toBe('cheap');
    expect(result.stations[1].node_id).toBe('expensive');
  });

  it('sorts alphabetically when no location', () => {
    const namedStations = [
      createTestStation({ node_id: 'z', trading_name: 'Zebra Fuel' }),
      createTestStation({ node_id: 'a', trading_name: 'Alpha Fuel' }),
    ];

    const result = searchStations(namedStations, baseFilters, fetchedAt);
    expect(result.stations[0].node_id).toBe('a');
    expect(result.stations[1].node_id).toBe('z');
  });

  it('returns total count', () => {
    const manyStations = Array.from({ length: 5 }, (_, index) =>
      createTestStation({ node_id: `s-${index}` }),
    );
    const result = searchStations(manyStations, baseFilters, fetchedAt);
    expect(result.total).toBe(5);
  });
});
