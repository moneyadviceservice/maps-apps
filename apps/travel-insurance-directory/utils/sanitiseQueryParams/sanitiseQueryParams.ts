import {
  FILTER_SECTIONS,
  LIMIT_OPTIONS,
} from 'data/components/filterOptions/filterConstants';
import { ParsedUrlQuery } from 'node:querystring';

export type QueryParams = Record<string, string | string[]>;
export type QueryInput = ParsedUrlQuery | URLSearchParams | QueryParams;

/**
 * Sanitizes Next.js URL query parameters against allowed UI filter options.
 * Discards unrecognized keys and invalid values.
 */
export function sanitiseQueryParams(query: QueryInput): QueryParams {
  const sanitised: QueryParams = {};

  // 1. Normalize input to a standard object map
  const rawQuery: Record<string, string | string[] | undefined> = {};

  // Duck-typing check: is it an object with 'keys' and 'getAll' methods?
  if (query && typeof (query as URLSearchParams).getAll === 'function') {
    const searchParams = query as URLSearchParams;
    const keys = Array.from(new Set(searchParams.keys()));
    keys.forEach((key) => {
      const values = searchParams.getAll(key);
      rawQuery[key] = values.length === 1 ? values[0] : values;
    });
  } else {
    // It's already a standard object
    Object.assign(rawQuery, query || {});
  }

  // 2. Validate dynamically driven filter sections against the normalized query
  FILTER_SECTIONS.forEach(({ paramKey, options }) => {
    const rawValue = rawQuery[paramKey];
    if (!rawValue) return;

    const valuesArray = Array.isArray(rawValue) ? rawValue : [rawValue];
    const validOptions = new Set(options.map((opt) => opt.value));

    const filteredValues = valuesArray.filter((val) => validOptions.has(val));

    if (filteredValues.length > 0) {
      sanitised[paramKey] =
        filteredValues.length === 1 ? filteredValues[0] : filteredValues;
    }
  });

  // 3. Validate standard parameters (like limit)
  const rawLimit = rawQuery['limit'];
  if (rawLimit) {
    // If multiple limits are passed (e.g. ?limit=10&limit=20), take the first one
    const limitStr = Array.isArray(rawLimit) ? rawLimit[0] : rawLimit;
    const limitNum = Number.parseInt(limitStr, 10);

    if (LIMIT_OPTIONS.includes(limitNum)) {
      sanitised['limit'] = limitStr;
    }
  }

  // 4. Allow safe structural/pagination keys to pass through
  const structuralKeys = ['p', 'lang', 'language', 'topic'];
  structuralKeys.forEach((key) => {
    if (rawQuery[key]) {
      sanitised[key] = rawQuery[key] as string;
    }
  });

  return sanitised;
}
