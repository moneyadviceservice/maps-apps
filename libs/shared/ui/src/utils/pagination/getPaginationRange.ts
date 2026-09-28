import { DOTS } from './CONSTANTS';
import { range } from './range';

export const getPaginationRange = (
  page: number,
  totalPages: number,
  pageRange = 1,
): (string | number)[] => {
  const totalPageNumbers = pageRange + 5;

  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(page - pageRange, 1);
  const rightSiblingIndex = Math.min(page + pageRange, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * pageRange;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, DOTS, totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * pageRange;
    const rightRange = range(totalPages - rightItemCount + 1, totalPages);
    return [firstPageIndex, DOTS, ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }

  return [];
};
