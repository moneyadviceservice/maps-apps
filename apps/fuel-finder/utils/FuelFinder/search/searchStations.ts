import type {
  FuelType,
  SearchFilters,
  SearchResult,
  Station,
  StationSearchResult,
} from '../types';
import { boundingBox, getDistanceInMiles } from './geo';

type StationPredicate = (station: Station) => boolean;

const isOpen = (station: Station) =>
  !station.permanent_closure && !station.temporary_closure;

const sellsFuel = (types: FuelType[]) => (station: Station) =>
  types.some((fuelType) =>
    station.fuel_prices.some((price) => price.fuel_type === fuelType),
  );

const hasAmenities = (required: string[]) => (station: Station) =>
  required.every((amenity) => station.amenities.includes(amenity));

const isSupermarket = (station: Station) =>
  station.is_supermarket_service_station;

const isMotorway = (station: Station) => station.is_motorway_service_station;

/** Requires at least one day of opening data — an empty `usual_days` is not
 *  treated as vacuously 24h. */
const isOpen24h = (station: Station) => {
  const days = Object.values(station.opening_times?.usual_days ?? {});
  return days.length > 0 && days.every((day) => day.is_24_hours);
};

const nameContains = (searchTerm: string) => {
  const query = searchTerm.toLowerCase();
  return (station: Station) =>
    station.trading_name.toLowerCase().includes(query);
};

const withinBounds =
  (box: ReturnType<typeof boundingBox>) => (station: Station) =>
    station.location.latitude >= box.minLat &&
    station.location.latitude <= box.maxLat &&
    station.location.longitude >= box.minLng &&
    station.location.longitude <= box.maxLng;

/** Compose the active predicates for the current filter state. `isOpen` is
 *  always applied; everything else is conditional on the relevant filter. */
function buildFilters(
  filters: SearchFilters,
  box: ReturnType<typeof boundingBox> | null,
): StationPredicate[] {
  return [
    { active: true, test: isOpen },
    {
      active: filters.fuelTypes.length > 0,
      test: sellsFuel(filters.fuelTypes),
    },
    {
      active: filters.amenities.length > 0,
      test: hasAmenities(filters.amenities),
    },
    { active: filters.supermarket, test: isSupermarket },
    { active: filters.motorway, test: isMotorway },
    { active: filters.open24h, test: isOpen24h },
    { active: !!filters.searchQuery, test: nameContains(filters.searchQuery) },
    ...(box ? [{ active: true, test: withinBounds(box) }] : []),
  ]
    .filter((entry) => entry.active)
    .map((entry) => entry.test);
}

/** Apply predicates and compute distance in a single pass. Stations outside
 *  `radius` are dropped here so the sort step doesn't see them. */
function filterAndEnrich(
  stations: Station[],
  predicates: StationPredicate[],
  lat: number | null,
  lng: number | null,
  radius: number | null,
): StationSearchResult[] {
  const hasLocation = lat != null && lng != null;

  return stations.reduce<StationSearchResult[]>((results, station) => {
    if (!predicates.every((predicate) => predicate(station))) return results;

    const distance = hasLocation
      ? getDistanceInMiles(
          lat,
          lng,
          station.location.latitude,
          station.location.longitude,
        )
      : undefined;

    if (distance != null && radius != null && distance > radius) return results;

    results.push({ ...station, distance });
    return results;
  }, []);
}

/** Sort by `price` (selected fuel), `distance` (when located), or
 *  alphabetically as a fallback. Missing prices/distances sort to the end. */
function sortResults(
  results: StationSearchResult[],
  sort: string,
  fuelTypes: FuelType[],
  hasLocation: boolean,
): StationSearchResult[] {
  const comparators: Record<
    string,
    ((a: StationSearchResult, b: StationSearchResult) => number) | undefined
  > = {
    price:
      fuelTypes.length > 0
        ? (a, b) => {
            const fuelType = fuelTypes[0];
            return (
              (a.fuel_prices.find((price) => price.fuel_type === fuelType)
                ?.price ?? Infinity) -
              (b.fuel_prices.find((price) => price.fuel_type === fuelType)
                ?.price ?? Infinity)
            );
          }
        : undefined,
    distance: hasLocation
      ? (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)
      : undefined,
  };

  const compare =
    comparators[sort] ??
    ((a, b) => a.trading_name.localeCompare(b.trading_name));

  return [...results].sort(compare);
}

/** Run the search pipeline: predicates → filter+enrich → sort. */
export function searchStations(
  allStations: Station[],
  filters: SearchFilters,
  fetchedAt: string,
): SearchResult {
  const { lat, lng, radius, sort, fuelTypes } = filters;
  const box =
    lat != null && lng != null && radius != null
      ? boundingBox(lat, lng, radius)
      : null;

  const predicates = buildFilters(filters, box);
  const filtered = filterAndEnrich(allStations, predicates, lat, lng, radius);
  const sorted = sortResults(
    filtered,
    sort,
    fuelTypes,
    lat != null && lng != null,
  );

  return { stations: sorted, total: sorted.length, fetchedAt };
}
