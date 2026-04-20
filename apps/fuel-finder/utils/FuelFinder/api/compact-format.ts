import type { FuelType } from '../types';

// Canonical ordering for bitmask encoding — must match between encoder and decoder
export const COMPACT_FUEL_TYPES: FuelType[] = [
  'E10',
  'E5',
  'B7_STANDARD',
  'B7_PREMIUM',
  'B10',
  'HVO',
];

export const COMPACT_AMENITIES: string[] = [
  'water_filling',
  'car_wash',
  'customer_toilets',
  'adblue_packaged',
  'adblue_pumps',
  'lpg_pumps',
];

// Station array field positions
export const S = {
  NODE_ID: 0,
  TRADING_NAME: 1,
  BRAND: 2,
  PHONE: 3,
  FLAGS: 4,
  ADDR1: 5,
  ADDR2: 6,
  CITY: 7,
  COUNTRY: 8,
  COUNTY: 9,
  POSTCODE: 10,
  LAT: 11,
  LNG: 12,
  AMENITIES: 13,
  OPENING_TIMES: 14,
  FUEL_TYPES: 15,
  FUEL_PRICES: 16,
} as const;

// Flags bitmask positions
export const FLAG_SAME_NAME = 1;
export const FLAG_TEMP_CLOSURE = 1 << 1;
export const FLAG_PERM_CLOSURE = 1 << 2;
export const FLAG_MOTORWAY = 1 << 3;
export const FLAG_SUPERMARKET = 1 << 4;

export const COMPACT_VERSION = 1;

// Day ordering in opening times tuples
export const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;
