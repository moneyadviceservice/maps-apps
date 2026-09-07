export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

export interface PaginationResult<T> {
  items: T[];
  pagination: Pagination;
}

/**
 * Paginates an array of items.
 * @param items - Array of items to paginate
 * @param params - Pagination parameters (page, limit)
 * @returns Paginated result with items and pagination metadata
 */
export function paginateItems<T>(
  items: T[],
  params: PaginationParams = {},
): PaginationResult<T> {
  const { page = 1, limit = 10 } = params;

  const currentPage = Math.max(1, Math.floor(page));
  const itemsPerPage = Math.max(1, Math.floor(limit));

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    pagination: {
      page: currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startIndex,
      endIndex,
    },
  };
}

export type PaginationQuery = Record<string, string | string[] | undefined>;

export interface ExtractPaginationOptions {
  defaultLimit?: number;
}

const DEFAULT_LIMIT = 10;

/**
 * Extract and validate pagination params from query (query param `p` = page).
 */
export function extractPaginationParams(
  query: PaginationQuery,
  options?: ExtractPaginationOptions,
): { page: number; limit: number } {
  const defaultLimit = options?.defaultLimit ?? DEFAULT_LIMIT;
  const page = query.p ? Number.parseInt(String(query.p), 10) : 1;
  const limit = query.limit
    ? Number.parseInt(String(query.limit), 10)
    : defaultLimit;

  return {
    page: Math.max(1, Math.floor(page || 1)),
    limit: Math.max(1, Math.min(100, Math.floor(limit || defaultLimit))),
  };
}

/**
 * Generates page range for pagination display.
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @param maxVisible - Maximum number of visible page buttons
 * @returns Array of page numbers to display
 */
export function generatePageRange(
  currentPage: number,
  totalPages: number,
  maxVisible = 5,
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Validates pagination parameters.
 * @param params - Pagination parameters to validate
 * @param defaultLimit - Default limit when not provided (default 10)
 * @returns Validated parameters with defaults applied
 */
export function validatePaginationParams(
  params: PaginationParams,
  defaultLimit = 10,
): PaginationParams {
  return {
    page: Math.max(1, Math.floor(params.page || 1)),
    limit: Math.max(1, Math.min(100, Math.floor(params.limit || defaultLimit))),
  };
}
