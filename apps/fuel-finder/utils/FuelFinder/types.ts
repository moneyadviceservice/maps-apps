export const FUEL_TYPES = [
  'E5',
  'E10',
  'B7_STANDARD',
  'B7_PREMIUM',
  'B10',
  'HVO',
] as const;

export type FuelType = (typeof FUEL_TYPES)[number];

export interface FuelPrice {
  fuel_type: FuelType;
  price: number;
  price_last_updated: string;
  price_change_effective_timestamp: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  country: string;
  county: string | null;
  postcode: string;
}

export interface DayHours {
  open: string;
  close: string;
  is_24_hours: boolean;
}

export interface BankHolidayHours {
  type: string;
  open_time: string;
  close_time: string;
  is_24_hours: boolean;
}

export interface OpeningTimes {
  usual_days: Record<string, DayHours>;
  bank_holiday?: BankHolidayHours;
}

export interface Station {
  node_id: string;
  trading_name: string;
  brand_name: string | null;
  public_phone_number: string | null;
  is_same_trading_and_brand_name: boolean;
  location: Location;
  amenities: string[];
  opening_times: OpeningTimes;
  fuel_types: FuelType[];
  temporary_closure: boolean;
  permanent_closure: boolean | null;
  permanent_closure_date: string | null;
  is_motorway_service_station: boolean;
  is_supermarket_service_station: boolean;
  fuel_prices: FuelPrice[];
}

export interface StationSearchResult extends Station {
  distance?: number;
}

export interface StationsData {
  fetchedAt: string;
  stations: Station[];
}

export interface SearchFilters {
  postcode: string;
  lat: number | null;
  lng: number | null;
  fuelTypes: FuelType[];
  amenities: string[];
  radius: number | null;
  sort: string;
  supermarket: boolean;
  motorway: boolean;
  open24h: boolean;
  searchQuery: string;
  page: number;
  perPage: number;
}

export interface SearchResult {
  stations: StationSearchResult[];
  total: number;
  fetchedAt: string;
}

// Compact format types — positional tuples that match the wire format.
// Field labels are visible in IDE tooltips and tsc errors.
export type CompactFuelPrice = [
  type_idx: number,
  price: number,
  last_updated: string,
];

export type CompactStation = [
  node_id: string,
  trading_name: string,
  brand_idx: number | null,
  phone: string | null,
  flags: number,
  addr1: string,
  addr2: string | null,
  city_idx: number | null,
  country_idx: number | null,
  county_idx: number | null,
  postcode: string,
  lat: number,
  lng: number,
  amenities_mask: number,
  opening_times_idx: number,
  fuel_types_mask: number,
  fuel_prices: CompactFuelPrice[],
];

export type CompactDay = [
  open: string | null,
  close: string | null,
  is_24h: boolean,
];
export type CompactBankHoliday = [
  type: string,
  open: string,
  close: string,
  is_24h: boolean,
];
export type CompactOpeningTimes = [
  days: CompactDay[],
  bank_holiday: CompactBankHoliday | null,
];

export interface CompactData {
  v: number;
  f: string;
  _b: string[];
  _ci: string[];
  _cn: string[];
  _co: string[];
  _ot: CompactOpeningTimes[];
  s: CompactStation[];
}
