import { createTestStation } from '../testHelpers';
import type { MapStation } from '../types';
import { rankByPrice, stationAnchorId, toMapStations } from './mapStations';

const mapStation = (overrides: Partial<MapStation> = {}): MapStation => ({
  id: 'station-1',
  name: 'Test Fuel Station',
  lat: 51.5,
  lng: -0.12,
  price: 132.9,
  distance: 1.5,
  page: 1,
  ...overrides,
});

describe('toMapStations', () => {
  it('projects a search result to the slim map shape', () => {
    expect(toMapStations([createTestStation()], 'E10', 3)).toEqual([
      {
        id: 'test-node-001',
        name: 'Test Fuel Station',
        lat: 51.5074,
        lng: -0.1278,
        price: 132.9,
        distance: 1.5,
        page: 1,
      },
    ]);
  });

  it('numbers pages from the position in the sorted list', () => {
    const stations = Array.from({ length: 7 }, (_, i) =>
      createTestStation({ node_id: `s-${i}` }),
    );

    const pages = toMapStations(stations, 'E10', 3).map((s) => s.page);

    expect(pages).toEqual([1, 1, 1, 2, 2, 2, 3]);
  });

  it('uses null when the station has no price for the fuel type or no distance', () => {
    const [station] = toMapStations(
      [createTestStation({ distance: undefined })],
      'HVO',
      3,
    );

    expect(station.price).toBeNull();
    expect(station.distance).toBeNull();
  });
});

describe('rankByPrice', () => {
  it('gives the cheapest station the highest zIndex', () => {
    const stations = [
      mapStation({ id: 'mid', price: 135 }),
      mapStation({ id: 'cheap', price: 130 }),
      mapStation({ id: 'dear', price: 140 }),
    ];

    expect(rankByPrice(stations)).toEqual([2, 3, 1]);
  });

  it('ranks stations without a price lowest', () => {
    const stations = [
      mapStation({ id: 'none', price: null }),
      mapStation({ id: 'priced', price: 140 }),
    ];

    const [none, priced] = rankByPrice(stations);

    expect(priced).toBeGreaterThan(none);
  });
});

describe('stationAnchorId', () => {
  it('prefixes the node id', () => {
    expect(stationAnchorId('4882e3fee979')).toBe('station-4882e3fee979');
  });
});
