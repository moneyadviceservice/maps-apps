/**
 * Query parameter helpers for travel insurance directory filters.
 * Form/URL keys align with Firm Cosmos schema (trip_type, cover_area, etc.).
 */

export type QueryParams = Record<string, string | string[] | undefined>;

/**
 * Get query value for a key, handling array notation (key[] / key%5B%5D).
 */
export function getQueryValue(
  query: QueryParams,
  key: string,
): string | string[] | undefined {
  return (
    query[key] ||
    query[`${key}%5B%5D`] ||
    query[`${key}[]`] ||
    query[decodeURIComponent(`${key}%5B%5D`)]
  );
}

/**
 * Generate a stable string key from query params (sorted keys) for use as React key.
 */
export function generateQueryKey(query: QueryParams): string {
  const sortedKeys = Object.keys(query).sort((a, b) => a.localeCompare(b));
  const sortedQuery = sortedKeys.reduce((acc, key) => {
    acc[key] = query[key];
    return acc;
  }, {} as QueryParams);
  return JSON.stringify(sortedQuery);
}

/**
 * Parse a query param into an array of strings (for multi-select filters).
 */
export function parseQueryParam(
  value: string | string[] | undefined,
): string[] {
  if (!value) return [];
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return Array.isArray(value)
    ? value.map((v) => String(v).trim()).filter(Boolean)
    : [];
}
