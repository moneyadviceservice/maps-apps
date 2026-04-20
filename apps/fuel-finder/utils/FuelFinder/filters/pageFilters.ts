import { NextRouter } from 'next/router';

import { FUEL_TYPES, type FuelType, type SearchFilters } from '../types';

const isFuelType = (value: string): value is FuelType =>
  (FUEL_TYPES as readonly string[]).includes(value);

type QueryObject = Record<string, string | string[] | undefined>;

const DEFAULTS = {
  sort: 'price',
  perPage: 3,
  page: 1,
  radiusMiles: '5',
  fuelType: 'E10',
} as const;

const FLAG_KEYS = ['supermarket', 'motorway', 'open24h', 'toilets'] as const;

/**
 * Read a single string value from a Next.js query object.
 *
 * Next.js types query params as `string | string[] | undefined` because the
 * same key can repeat (`?x=a&x=b`). The fuel-finder form only ever sends each
 * key once, but we defensively take the first element if an array slips in
 * (e.g. via a hand-crafted deep link).
 */
function readString(query: QueryObject, key: string, fallback = ''): string {
  const raw = query[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value || fallback;
}

function readFlag(query: QueryObject, key: string): boolean {
  return readString(query, key) === 'true';
}

function readInt(query: QueryObject, key: string, fallback: number): number {
  const raw = readString(query, key);
  return raw ? Number.parseInt(raw, 10) : fallback;
}

/**
 * Returns `null` (rather than `NaN` or `0`) when the param is missing, so
 * callers can distinguish "not set" from "set to zero".
 */
function readFloat(query: QueryObject, key: string): number | null {
  const raw = readString(query, key);
  return raw ? Number.parseFloat(raw) : null;
}

export function extractSearchFilters(query: QueryObject): SearchFilters {
  const fuelType = readString(query, 'fuelType', DEFAULTS.fuelType);
  const fuelTypes: FuelType[] = isFuelType(fuelType) ? [fuelType] : [];
  const amenities = readFlag(query, 'toilets') ? ['customer_toilets'] : [];

  return {
    postcode: readString(query, 'postcode'),
    lat: readFloat(query, 'lat'),
    lng: readFloat(query, 'lng'),
    fuelTypes,
    amenities,
    radius:
      readFloat(query, 'radius') ?? Number.parseFloat(DEFAULTS.radiusMiles),
    sort: readString(query, 'sort', DEFAULTS.sort),
    supermarket: readFlag(query, 'supermarket'),
    motorway: readFlag(query, 'motorway'),
    open24h: readFlag(query, 'open24h'),
    searchQuery: readString(query, 'q'),
    page: readInt(query, 'p', DEFAULTS.page),
    perPage: readInt(query, 'perPage', DEFAULTS.perPage),
  };
}

/**
 * Chainable URL builder for client-side action methods. Starts from a copy of
 * the current query object and exposes `set` / `remove` / `resetPage` /
 * `toString` so consumers can compose URL updates fluently.
 *
 * `resetPage` is called whenever filters change so the user doesn't land on
 * an empty page beyond the new result count.
 */
function buildQuery(base: QueryObject) {
  const obj = { ...base };

  const builder = {
    set(key: string, value: string | number) {
      obj[key] = String(value);
      return builder;
    },
    remove(key: string) {
      delete obj[key];
      return builder;
    },
    resetPage() {
      obj.p = '1';
      return builder;
    },
    toString() {
      const params = new URLSearchParams();
      for (const [key, val] of Object.entries(obj)) {
        if (val != null && val !== '') params.set(key, String(val));
      }
      return '?' + params.toString();
    },
  };

  return builder;
}

export interface PageFilters {
  count: number;
  page: number;
  sort: string;
  perPage: number;
  postcode: string;
  fuelType: FuelType | '';
  supermarket: boolean;
  motorway: boolean;
  open24h: boolean;
  toilets: boolean;
  radius: string;
  setSort: (value: string) => Promise<boolean>;
  setPerPage: (value: string | number) => Promise<boolean>;
  removeFilterHref: (param: string) => string;
  clearAllFiltersHref: string;
  isFilterActive: (param: string) => boolean;
  setPageHref: (page: string | number) => string;
}

interface RouterLike {
  query: QueryObject;
  push?: (
    url: string,
    as?: string,
    options?: { scroll?: boolean },
  ) => Promise<boolean>;
}

const pageFilters = (router: NextRouter | RouterLike): PageFilters => {
  const { query } = router;
  const filters = extractSearchFilters(query);
  const fuelType = filters.fuelTypes[0] ?? '';
  const activeFlags = FLAG_KEYS.filter((key) => readFlag(query, key));
  const count = activeFlags.length;

  const navigate = (url: string): Promise<boolean> =>
    router.push
      ? router.push(url, undefined, { scroll: false })
      : Promise.resolve(true);

  return {
    count,
    page: filters.page,
    sort: filters.sort,
    perPage: filters.perPage,
    postcode: filters.postcode,
    fuelType,
    supermarket: filters.supermarket,
    motorway: filters.motorway,
    open24h: filters.open24h,
    toilets: readFlag(query, 'toilets'),
    radius: readString(query, 'radius', DEFAULTS.radiusMiles),

    setSort: (value) =>
      navigate(buildQuery(query).set('sort', value).resetPage().toString()),

    setPerPage: (value) =>
      navigate(buildQuery(query).set('perPage', value).resetPage().toString()),

    removeFilterHref: (param) =>
      buildQuery(query).remove(param).resetPage().toString(),

    clearAllFiltersHref: (() => {
      let b = buildQuery(query).remove('fuelType');
      for (const key of FLAG_KEYS) b = b.remove(key);
      return b.resetPage().toString();
    })(),

    isFilterActive: (param) => readFlag(query, param),

    setPageHref: (page) => buildQuery(query).set('p', page).toString(),
  };
};

export default pageFilters;
