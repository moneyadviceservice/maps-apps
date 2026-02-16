import Link from 'next/link';
import { useRouter } from 'next/router';

import { twMerge } from 'tailwind-merge';

import ChevronLeft from '../../assets/images/chevron-left.svg';
import ChevronRight from '../../assets/images/chevron-right.svg';
import { Button } from '../../components/Button';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import range from './range';
import { NumberOfAccounts } from './NumberOfAccounts';

const DOTS = '...';

export type PaginationProps = {
  page: number;
  totalPages: number;
  pageRange?: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
};

export const AccountPagination = ({
  page,
  totalPages,
  pageRange = 1,
  startIndex,
  endIndex,
  totalItems,
}: PaginationProps) => {
  const { z } = useTranslation();
  const router = useRouter();

  const nextPrevClasses = [
    'border-4 rounded-md text-magenta-500 visited:!text-magenta-500',
  ];

  const numberClasses = [
    'flex',
    'text-base',
    'items-center',
    'underline',
    'px-3.5',
    'py-1',
    'border-4',
    'rounded-bl-lg',
  ];

  const hoverClasses = [
    'hover:bg-gray-200',
    'hover:!text-pink-900',
    'hover:border-gray-200',
    'hover:outline-0',
    'hover:no-underline',
  ];

  const focusClasses = [
    'focus:bg-yellow-400',
    'focus:border-blue-700',
    'focus:!text-gray-800',
    'focus:outline-0',
    'focus:shadow-none',
  ];

  const activeClasses = [
    'active:!bg-gray-200',
    'active:border-gray-200',
    'active:!text-gray-800',
    'active:outline-0',
    'active:underline',
  ];

  const paginationRange = (): (string | number)[] => {
    const totalPageNumbers = pageRange + 5;

    /*
      Check if the totalPages are less the number of pages we 
      want to show
    */
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

  const setPageHref = (value: string) => {
    const query = { ...router.query };
    query['p'] = value;
    return (
      '?' +
      Object.keys(query)
        .map((key) => key + '=' + query[key])
        .join('&')
    );
  };

  const focusMainContent = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.focus();
  };

  const pages = paginationRange();

  const nextPage = Math.min(page + 1, totalPages).toString();
  const previousPage = Math.max(page - 1, 1).toString();

  let activeIndex: null | number = null;

  return (
    <div className="flex flex-col py-2 space-x-1 lg:flex-row border-y border-slate-400">
      <NumberOfAccounts
        classes="hidden lg:flex items-center justify-center lg:justify-start"
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
      />
      <nav
        className="flex flex-wrap justify-center space-y-2 t-pagination lg:space-x-1 lg:space-y-0 lg:grow"
        aria-label="pagination"
      >
        {page !== 1 && totalItems > 0 && (
          <Button
            variant="link"
            href={setPageHref(previousPage)}
            as="a"
            iconLeft={<ChevronLeft />}
            className={twMerge(
              nextPrevClasses,
              hoverClasses,
              focusClasses,
              activeClasses,
              't-previous sm:flex-none justify-self-start mt-2 lg:mt-0 pl-2 border-white',
            )}
          >
            {z({ en: 'Previous', cy: 'Blaenorol' })}
          </Button>
        )}

        <ul className="flex items-center justify-center flex-1 min-w-full space-x-1 lg:flex-none lg:min-w-fit">
          {pages.map((i, index) => {
            const active = i === page;
            if (active) {
              activeIndex = index;
            }
            const hideOnMobile =
              index !== 0 && i !== page && index !== pages.length - 1;

            if (i === DOTS) {
              return (
                <li key={index} className="text-magenta-500">
                  &#8230;
                </li>
              );
            }

            // Checks active is not 0 (by making sure it has not yet been set), active is not current
            const addDotsToStart =
              !active && activeIndex === null && index === 1;

            return (
              <li key={index}>
                {addDotsToStart && (
                  <span key={index} className="mr-2 text-magenta-500 md:hidden">
                    &#8230;
                  </span>
                )}
                <Link
                  href={setPageHref(String(i))}
                  onClick={focusMainContent}
                  {...(i === page && { 'aria-current': 'page' })}
                  id={'page-' + i}
                  title={z(
                    {
                      en: 'Go to page number {i}',
                      cy: 'Ewch i dudalen rhif {i}',
                    },
                    { i: i.toString() },
                  )}
                  className={twMerge(
                    numberClasses,
                    active
                      ? activeClasses
                      : twMerge(hoverClasses, focusClasses, activeClasses),
                    't-page',
                    active && 't-selected',
                    active && 'bg-magenta-500',
                    active && 'text-white',
                    !active && 'text-magenta-500',
                    active && 'no-underline',
                    active && 'border-magenta-500',
                    !active && 'border-white',
                    hideOnMobile && 'hidden md:block',
                    active && 'cursor-default',
                  )}
                >
                  {i}
                </Link>
              </li>
            );
          })}
        </ul>
        {page < totalPages && (
          <Button
            variant="link"
            href={setPageHref(nextPage)}
            as="a"
            className={twMerge(
              nextPrevClasses,
              hoverClasses,
              focusClasses,
              activeClasses,
              'order-4 justify-self-end t-next pr-2 border-white',
            )}
            iconRight={<ChevronRight />}
            data-testid="next-button"
          >
            {z({ en: 'Next', cy: 'Nesaf' })}
          </Button>
        )}
      </nav>
    </div>
  );
};

export default AccountPagination;
