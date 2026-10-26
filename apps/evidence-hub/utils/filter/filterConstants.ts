/**
 * Shared constants for filter configuration
 */

export interface YearOption {
  id: string;
  label: string;
  value: string;
}

/**
 * Year filter options
 */
export const YEAR_OPTIONS: YearOption[] = [
  { id: 'all-years', label: 'All years', value: 'all' },
  { id: 'last-2-years', label: 'Last 2 years', value: 'last-2' },
  { id: 'last-5-years', label: 'Last 5 years', value: 'last-5' },
  {
    id: 'more-than-5-years',
    label: 'More than 5 years ago',
    value: 'more-than-5',
  },
];

/**
 * Sort order options
 */
export interface SortOption {
  text: string;
  value: 'relevance' | 'published' | 'updated';
}

export const SORT_OPTIONS: SortOption[] = [
  { text: 'Relevance', value: 'relevance' },
  { text: 'Published Date', value: 'published' },
  { text: 'Recently Uploaded', value: 'updated' },
];

/**
 * Valid sort order values
 */
export const VALID_SORT_ORDERS: Array<'relevance' | 'published' | 'updated'> = [
  'relevance',
  'published',
  'updated',
];

/**
 * Pagination options
 */
export const PAGINATION_OPTIONS = Array.from({ length: 5 }, (_, index) => {
  const pageSize = (index + 1) * 10;
  return {
    text: `${pageSize} per page`,
    value: pageSize.toString(),
  };
});
