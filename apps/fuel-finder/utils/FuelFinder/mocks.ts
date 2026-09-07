import { createTestStation } from '../../utils/FuelFinder/testHelpers';
import type { StationSearchResult } from '../../utils/FuelFinder/types';

export const mockStation: StationSearchResult = createTestStation();

export const mockStations: StationSearchResult[] = [
  createTestStation({
    node_id: 'station-001',
    trading_name: 'Shell London Bridge',
    brand_name: 'Shell',
    distance: 0.8,
  }),
  createTestStation({
    node_id: 'station-002',
    trading_name: 'BP Waterloo',
    brand_name: 'BP',
    is_supermarket_service_station: false,
    distance: 1.2,
  }),
  createTestStation({
    node_id: 'station-003',
    trading_name: 'Tesco Extra Bermondsey',
    brand_name: 'Tesco',
    is_supermarket_service_station: true,
    distance: 2.1,
    fuel_prices: [
      {
        fuel_type: 'E10',
        price: 129.9,
        price_last_updated: '2025-01-15T10:00:00Z',
        price_change_effective_timestamp: '2025-01-15T10:00:00Z',
      },
      {
        fuel_type: 'B7_STANDARD',
        price: 134.9,
        price_last_updated: '2025-01-15T10:00:00Z',
        price_change_effective_timestamp: '2025-01-15T10:00:00Z',
      },
    ],
  }),
];
