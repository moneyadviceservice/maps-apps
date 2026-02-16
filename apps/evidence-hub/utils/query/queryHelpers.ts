/**
 * Shared utilities for query parameter handling
 */

export type QueryParamValue = string | string[] | undefined;
export type QueryParams = Record<string, string | string[] | undefined>;

export type SortOrder = 'relevance' | 'published' | 'updated';

/**
 * Parse query parameter into array of strings
 */
export function parseQueryParam(value: QueryParamValue): string[] {
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
 * Normalize a query parameter value to a string
 */
export function normalizeToString(
  value: string | string[] | undefined,
): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (Array.isArray(value) && value.length > 0) {
    const firstValue = value[0];
    return String(firstValue).trim();
  }
  return '';
}

/**
 * Get query value for a given key, handling both clean and encoded versions
 * Used in components to handle URL-encoded array notation
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
 * Determine the default sort order based on keyword and current order
 * Centralizes the logic: if keyword exists and no order specified, default to 'relevance'
 */
export function determineDefaultOrder(
  keyword: string | undefined,
  order: QueryParamValue,
): SortOrder | undefined {
  const trimmedKeyword = keyword?.trim();
  const trimmedOrder = normalizeToString(order);

  const validOrderValues: SortOrder[] = ['relevance', 'published', 'updated'];
  const orderValue =
    trimmedOrder && validOrderValues.includes(trimmedOrder as SortOrder)
      ? (trimmedOrder as SortOrder)
      : undefined;

  // Default to 'relevance' when keyword is present but no order is specified
  if (!orderValue && trimmedKeyword && trimmedKeyword.length > 0) {
    return 'relevance';
  }

  return orderValue;
}

/**
 * Build query object with defaults applied
 * Ensures consistent default application across server and client
 */
export function buildQueryWithDefaults(query: QueryParams): QueryParams {
  const keyword =
    typeof query.keyword === 'string' ? query.keyword.trim() : undefined;

  // Normalize order value (handle arrays) - always normalize to string if it exists
  const normalizedOrder =
    query.order === undefined ? undefined : normalizeToString(query.order);
  const hasOrder = normalizedOrder ? normalizedOrder.length > 0 : false;

  const defaultOrder = determineDefaultOrder(keyword, query.order);

  // Build result, normalizing order to string if it exists
  const result: QueryParams = { ...query };

  if (query.order !== undefined) {
    // Order exists in query - normalize to string
    if (hasOrder) {
      result.order = normalizedOrder;
    } else if (keyword && keyword.length > 0 && defaultOrder) {
      // Empty/invalid order but keyword exists - use default
      result.order = defaultOrder;
    } else {
      // Empty/invalid order, no keyword - remove it
      result.order = undefined;
    }
  } else if (keyword && keyword.length > 0 && defaultOrder) {
    // No order in query, but keyword exists - apply default
    result.order = defaultOrder;
  }

  return result;
}

/**
 * Extract keyword from query parameters
 */
export function extractKeyword(query: QueryParams): string | undefined {
  const keyword =
    typeof query.keyword === 'string' ? query.keyword.trim() : undefined;
  return keyword && keyword.length > 0 ? keyword : undefined;
}

/**
 * Check if query has a keyword
 */
export function hasKeyword(query: QueryParams): boolean {
  return extractKeyword(query) !== undefined;
}
