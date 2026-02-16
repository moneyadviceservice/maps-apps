/**
 * Listings page filter helpers – active filters, remove link, limit.
 * Mirrors compare-accounts pageFilters pattern.
 */

import type { QueryParams } from 'utils/query/queryHelpers';

/**
 * Build listings URL search string from query params (omits empty values).
 */
export function buildListingsSearchParams(query: QueryParams): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === '') continue;
    if (Array.isArray(value)) {
      const filtered = value.filter((v) => String(v).trim() !== '');
      if (filtered.length > 0) params.set(key, filtered.join(','));
    } else if (String(value).trim() !== '') {
      params.set(key, String(value).trim());
    }
  }

  return params;
}

/**
 * Build query without a param and with p=1.
 */
function queryWithoutParam(query: QueryParams, paramKey: string): QueryParams {
  const next: QueryParams = { ...query };
  delete next[paramKey];
  delete next[`${paramKey.replace('[]', '')}%5B%5D`];
  next.p = '1';
  return next;
}

/**
 * Build query with limit and p=1.
 */
function queryWithLimit(query: QueryParams, limit: number): QueryParams {
  const next: QueryParams = { ...query, limit: String(limit), p: '1' };
  return next;
}

/**
 * Build href for removing a single filter (resets to page 1).
 */
export function removeFilterHref(query: QueryParams, paramKey: string): string {
  const next = queryWithoutParam(query, paramKey);
  const params = buildListingsSearchParams(next);
  const search = params.toString();
  return search ? `?${search}` : '';
}

/**
 * Build href for setting items per page (resets to page 1).
 */
export function setLimitHref(query: QueryParams, limit: number): string {
  const next = queryWithLimit(query, limit);
  const params = buildListingsSearchParams(next);
  const search = params.toString();
  return search ? `?${search}` : `?limit=${limit}&p=1`;
}

/**
 * Get current limit from query (default 5).
 */
export function getLimit(query: QueryParams): number {
  const limit = query.limit;
  if (!limit) return 5;
  const n =
    typeof limit === 'string' ? Number.parseInt(limit, 10) : Number(limit);
  return Number.isFinite(n) && n >= 1 && n <= 100 ? n : 5;
}
