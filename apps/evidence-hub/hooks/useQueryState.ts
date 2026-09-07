import { useMemo } from 'react';

import { useRouter } from 'next/router';

import {
  buildQueryWithDefaults,
  determineDefaultOrder,
  extractKeyword,
  hasKeyword,
  QueryParams,
} from 'utils/query/queryHelpers';

/**
 * Hook for managing query state with defaults applied
 * Provides consistent query parameter handling across components
 */
export function useQueryState() {
  const router = useRouter();
  const query = router.query as QueryParams;

  // Memoize query with defaults applied
  const queryWithDefaults = useMemo(() => {
    return buildQueryWithDefaults(query);
  }, [query]);

  // Extract common values
  const keyword = useMemo(() => extractKeyword(query), [query]);
  const hasKeywordValue = useMemo(() => hasKeyword(query), [query]);
  const currentOrder = useMemo(() => {
    return typeof queryWithDefaults.order === 'string'
      ? queryWithDefaults.order
      : hasKeywordValue
      ? 'relevance'
      : 'published';
  }, [queryWithDefaults.order, hasKeywordValue]);

  return {
    query,
    queryWithDefaults,
    keyword,
    hasKeyword: hasKeywordValue,
    currentOrder,
  };
}

/**
 * Hook for filter defaults
 * Centralizes default value logic for filters
 */
export function useFilterDefaults(query: QueryParams) {
  return useMemo(() => {
    const keyword = extractKeyword(query);
    const order = determineDefaultOrder(keyword, query.order);

    return {
      keyword: keyword || '',
      order: order || (keyword ? 'relevance' : 'published'),
    };
  }, [query]);
}
