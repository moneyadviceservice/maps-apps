/**
 * Utility functions for processing query parameters
 */

export type QueryParams = Record<string, string | string[] | undefined>;

/**
 * Process filter query parameters to handle array parameters and duplicate keys
 * @param rawFilterQuery - Raw query parameters from the request
 * @returns Processed filter query object
 */
export function processFilterQuery(rawFilterQuery: QueryParams): QueryParams {
  const groupedParams: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(rawFilterQuery)) {
    const decodedKey = decodeURIComponent(key);
    const cleanKey = getCleanKey(decodedKey, key);

    if (!groupedParams[cleanKey]) {
      groupedParams[cleanKey] = [];
    }

    if (Array.isArray(value)) {
      groupedParams[cleanKey].push(...value);
    } else if (value) {
      groupedParams[cleanKey].push(value);
    }
  }

  return convertGroupedParamsToQuery(groupedParams);
}

/**
 * Clean array parameter keys by removing array notation
 * @param decodedKey - Decoded key from URL
 * @param originalKey - Original key from URL
 * @returns Cleaned key without array notation
 */
export function getCleanKey(decodedKey: string, originalKey: string): string {
  if (decodedKey.endsWith('[]') || originalKey.includes('%5B%5D')) {
    return decodedKey.endsWith('[]')
      ? decodedKey.slice(0, -2)
      : originalKey.replace('%5B%5D', '');
  }
  return decodedKey;
}

/**
 * Convert grouped parameters to final query object
 * @param groupedParams - Grouped parameters by key
 * @returns Final query object with unique values joined by commas
 */
export function convertGroupedParamsToQuery(
  groupedParams: Record<string, string[]>,
): QueryParams {
  const filterQuery: QueryParams = {};

  for (const [key, values] of Object.entries(groupedParams)) {
    if (values.length > 0) {
      const uniqueValues = [
        ...new Set(values.filter((v) => v && v.trim() !== '')),
      ];
      filterQuery[key] = uniqueValues.join(',');
    }
  }

  return filterQuery;
}

export { extractPaginationParams } from '@maps-react/utils/pagination';
