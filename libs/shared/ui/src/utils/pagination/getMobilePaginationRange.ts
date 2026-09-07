import { DOTS } from './CONSTANTS';
import { range } from './range';

export const getMobilePaginationRange = (
  page: number,
  totalPages: number,
): (string | number)[] => {
  if (totalPages <= 3) {
    return range(1, totalPages);
  }

  const mobilePages: (number | string)[] = [1];

  if (page !== 1 && page !== totalPages) {
    if (page > 2) {
      mobilePages.push(DOTS);
    }
    mobilePages.push(page);
    if (page < totalPages - 1) {
      mobilePages.push(DOTS);
    }
  } else {
    mobilePages.push(DOTS);
  }

  mobilePages.push(totalPages);
  return mobilePages;
};
