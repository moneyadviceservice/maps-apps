/**
 * Query parameter helpers for travel insurance directory filters.
 * Form/URL keys align with Firm Cosmos schema (trip_type, cover_area, etc.).
 */

import type { AdminSearchParams } from 'lib/admin/dashboard/firmListPipeline';
import type { SortDir } from 'types/admin';

export type QueryParams = Record<string, string | string[] | undefined>;

export type QueryStringEntry = string | string[] | undefined;

/** First value when Next.js query params repeat as `string[]` (same idea as a single `?key=`). */
export function firstQueryStringParam(value: QueryStringEntry): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0) {
    return String(value[0]);
  }
  return '';
}

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
export function parseQueryParam(value: QueryStringEntry): string[] {
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

/**
 * Parse admin dashboard table sort query (`sortBy` / `sortDir`) for getServerSideProps.
 * Default list (no column sort): newest-first uses `sortDir: 'desc'` with Cosmos fallback.
 */
export function parseAdminDashboardSortParams(query: QueryParams): {
  sortBy: string | null;
  sortDir: SortDir;
} {
  const sortByRaw = firstQueryStringParam(query.sortBy).trim();
  const sortBy = sortByRaw.length > 0 ? sortByRaw : null;

  const sortDirRaw = firstQueryStringParam(query.sortDir).trim();

  let sortDir: SortDir;
  if (sortDirRaw === 'desc') {
    sortDir = 'desc';
  } else if (sortDirRaw === 'asc') {
    sortDir = 'asc';
  } else if (sortBy) {
    sortDir = 'asc';
  } else {
    sortDir = 'desc';
  }

  return { sortBy, sortDir };
}

function parseAdminDashboardPage(query: QueryParams): number {
  const pRaw = query.p;
  if (typeof pRaw === 'string') {
    const n = Number(pRaw);
    return Number.isFinite(n) ? Math.max(1, n) : 1;
  }
  if (Array.isArray(pRaw) && pRaw.length > 0) {
    const n = Number(String(pRaw[0]));
    return Number.isFinite(n) ? Math.max(1, n) : 1;
  }
  return 1;
}

/**
 * Parse admin dashboard list URL query for getServerSideProps (search + pagination + sort).
 */
export function parseAdminDashboardListQuery(query: QueryParams): {
  search: AdminSearchParams;
  page: number;
} {
  const { sortBy, sortDir } = parseAdminDashboardSortParams(query);

  return {
    search: {
      principalName:
        typeof query.principalName === 'string' ? query.principalName : null,
      fcaNumber: typeof query.fcaNumber === 'string' ? query.fcaNumber : null,
      firmName: typeof query.firmName === 'string' ? query.firmName : null,
      sortBy,
      sortDir,
    },
    page: parseAdminDashboardPage(query),
  };
}
