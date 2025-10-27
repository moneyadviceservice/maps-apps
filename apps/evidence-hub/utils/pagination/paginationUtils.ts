export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface Pagination {
  currentPage: number;
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
 * Paginates an array of items
 * @param items - Array of items to paginate
 * @param params - Pagination parameters
 * @returns Paginated result with items and pagination metadata
 */
export function paginateItems<T>(
  items: T[],
  params: PaginationParams = {},
): PaginationResult<T> {
  const { page = 1, limit = 10 } = params;

  // Ensure page and limit are positive numbers
  const currentPage = Math.max(1, Math.floor(page));
  const itemsPerPage = Math.max(1, Math.floor(limit));

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate indices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get paginated items
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startIndex: startIndex + 1, // 1-based index for display
      endIndex,
    },
  };
}

/**
 * Generates page range for pagination display
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

  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Validates pagination parameters
 * @param params - Pagination parameters to validate
 * @returns Validated parameters with defaults applied
 */
export function validatePaginationParams(
  params: PaginationParams,
): PaginationParams {
  return {
    page: Math.max(1, Math.floor(params.page || 1)),
    limit: Math.max(1, Math.min(100, Math.floor(params.limit || 10))), // Max 100 items per page
  };
}
