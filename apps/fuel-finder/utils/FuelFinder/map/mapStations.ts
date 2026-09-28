import type { FuelType, MapStation, StationSearchResult } from '../types';

/**
 * Reduce the full, sorted search result to what the map plots. Each station
 * keeps its place in the list as a page number, so a pin can link straight to
 * the page holding its card. `perPage` is the page size `paginateItems`
 * settled on, which keeps the two splits identical.
 */
export function toMapStations(
  stations: StationSearchResult[],
  fuelType: FuelType | undefined,
  perPage: number,
): MapStation[] {
  return stations.map((station, index) => ({
    id: station.node_id,
    name: station.trading_name,
    lat: station.location.latitude,
    lng: station.location.longitude,
    price:
      station.fuel_prices.find((p) => p.fuel_type === fuelType)?.price ?? null,
    distance: station.distance ?? null,
    page: Math.floor(index / perPage) + 1,
  }));
}

const NO_PRICE = Number.POSITIVE_INFINITY;

/**
 * A zIndex for each station (aligned with the input) so that, where pins
 * overlap, the cheaper one stays on top and collision handling hides the
 * dearer one first. Stations without a price rank lowest.
 */
export function rankByPrice(stations: MapStation[]): number[] {
  const byPrice = stations
    .map((station, index) => ({ index, price: station.price ?? NO_PRICE }))
    .sort((a, b) => a.price - b.price);

  const zIndexes: number[] = new Array(stations.length);
  byPrice.forEach(({ index }, rank) => {
    zIndexes[index] = stations.length - rank;
  });
  return zIndexes;
}

export const stationAnchorId = (nodeId: string): string => `station-${nodeId}`;
