import React from 'react';

import { twMerge } from 'tailwind-merge';
import { Pagination as PaginationType } from 'utils/pagination/paginationUtils';

import { Button, Icon, IconType } from '@maps-react/common/index';

export interface PaginationProps {
  pagination: PaginationType;
  onPageChange?: (page: number) => void;
  className?: string;
  baseUrl?: string; // Base URL for server-side navigation
  query?: Record<string, string | string[] | undefined>; // Current query parameters
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  className,
  baseUrl,
  query = {},
}) => {
  const {
    currentPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
  } = pagination;
  const generatePageRange = (): number[] => {
    const maxVisible = 10;
    if (totalPages <= maxVisible) {
      return generateSimplePageRange(totalPages);
    }
    return generateComplexPageRange(maxVisible);
  };

  const generateSimplePageRange = (totalPages: number): number[] => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const generateComplexPageRange = (maxVisible: number): number[] => {
    const { start, end } = calculatePageRangeBounds(maxVisible);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const calculatePageRangeBounds = (
    maxVisible: number,
  ): { start: number; end: number } => {
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return { start, end };
  };

  const pageRange = generatePageRange();

  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Generate URL for a specific page (for server-side navigation)
  const generatePageUrl = (page: number): string => {
    if (!baseUrl) return '#';

    const searchParams = new URLSearchParams();

    // Add all current query parameters except page
    // This preserves all parameters including limit, filters, search terms, etc.
    // Only the 'page' parameter is excluded and replaced with the new page number
    for (const [key, value] of Object.entries(query)) {
      if (key !== 'page' && value) {
        searchParams.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    }

    // Add the new page
    if (page > 1) {
      searchParams.set('page', page.toString());
    }

    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={twMerge(
        'flex flex-col sm:flex-row items-center justify-between xl:justify-center gap-2 py-6 relative',
        className,
      )}
    >
      <div className="text-sm text-gray-600 xl:absolute left-0">
        {startIndex} - {endIndex} of {totalItems}
      </div>

      <div className="flex items-center gap-2">
        {hasPreviousPage && (
          <Button
            as={'a'}
            className="visited:text-magenta-500"
            href={baseUrl ? generatePageUrl(currentPage - 1) : undefined}
            variant={hasPreviousPage ? 'link' : 'transparent'}
            iconLeft={<Icon type={IconType.CHEVRON_LEFT} className="w-3 h-3" />}
            onClick={
              baseUrl ? undefined : () => handlePageClick(currentPage - 1)
            }
          >
            Previous
          </Button>
        )}
        <div className="flex items-center gap-2 hidden xl:flex">
          {pageRange.map((page) => (
            <Button
              as="a"
              key={page}
              className={
                currentPage === page
                  ? 'active:text-white'
                  : 'visited:text-magenta-500'
              }
              href={baseUrl ? generatePageUrl(page) : undefined}
              variant={currentPage === page ? 'primary' : 'link'}
              onClick={baseUrl ? undefined : () => handlePageClick(page)}
            >
              {page}
            </Button>
          ))}
        </div>

        {hasNextPage && (
          <Button
            as={'a'}
            className="visited:text-magenta-500"
            href={baseUrl ? generatePageUrl(currentPage + 1) : undefined}
            variant={hasNextPage ? 'link' : 'transparent'}
            iconRight={
              <Icon
                type={IconType.CHEVRON_RIGHT}
                className="w-3 h-3 text-blue-500"
              />
            }
            onClick={
              baseUrl ? undefined : () => handlePageClick(currentPage + 1)
            }
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
