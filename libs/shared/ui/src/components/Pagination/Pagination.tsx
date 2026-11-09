import Link from 'next/link';
import { useRouter } from 'next/router';

import { twMerge } from 'tailwind-merge';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import ChevronLeft from '../../assets/images/chevron-left.svg';
import ChevronRight from '../../assets/images/chevron-right.svg';
import { Button } from '../../components/Button';
import {
  buildPageHref,
  DOTS,
  getMobilePaginationRange,
  getPaginationRange,
} from '../../utils/pagination';
import { NumberOfAccounts } from './NumberOfAccounts';

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

  if (totalPages <= 1) {
    return null;
  }

  const nextPrevClasses = [
    'border-4 rounded-md text-magenta-500 visited:!text-magenta-500',
  ];

  const numberClasses = [
    'flex',
    'text-base',
    'items-center',
    'px-3.5',
    'py-1',
    'border-4',
    'rounded-bl-lg',
  ];

  const hoverClasses = [
    'hover:!text-pink-900',
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

  const activeClasses = ['active:!text-gray-800', 'active:outline-0'];

  const focusMainContent = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.focus();
  };

  // Get arrays from utilities
  const desktopPages = getPaginationRange(page, totalPages, pageRange);
  const mobilePages = getMobilePaginationRange(page, totalPages);

  const nextPage = Math.min(page + 1, totalPages).toString();
  const previousPage = Math.max(page - 1, 1).toString();

  // Unified rendering helper for pagination items to prevent duplicate code blocks
  const renderPageItem = (
    i: string | number,
    index: number,
    isMobileOnly: boolean,
    hideOnDesktopMobile?: boolean,
  ) => {
    const key = `${isMobileOnly ? 'mobile' : 'desktop'}-${i}-${index}`;

    if (i === DOTS) {
      return (
        <li
          key={key}
          className={twMerge(
            'text-magenta-500 px-2',
            isMobileOnly ? 'md:hidden' : '',
          )}
        >
          &#8230;
        </li>
      );
    }

    const active = i === page;
    let baseResponsiveClass = '';

    if (isMobileOnly) {
      baseResponsiveClass = 'md:hidden';
    } else if (hideOnDesktopMobile) {
      baseResponsiveClass = 'hidden md:block';
    }

    return (
      <li key={key} className={baseResponsiveClass}>
        {active ? (
          <span
            aria-current="page"
            id={`${isMobileOnly ? 'mobile-' : ''}page-${i}`}
            data-testid={`${
              isMobileOnly ? 'mobile-' : 'desktop-'
            }active-page-${i}`}
            title={z(
              { en: 'Page number {i}', cy: 'Tudalen rhif {i}' },
              { i: i.toString() },
            )}
            className={twMerge(
              numberClasses,
              activeClasses,
              't-page t-selected bg-magenta-500 text-white no-underline border-magenta-500 cursor-default',
            )}
          >
            {i}
          </span>
        ) : (
          <Link
            href={buildPageHref(router.query, String(i))}
            onClick={focusMainContent}
            id={`${isMobileOnly ? 'mobile-' : ''}page-${i}`}
            data-testid={`${
              isMobileOnly ? 'mobile-' : 'desktop-'
            }inactive-page-${i}`}
            title={z(
              { en: 'Go to page number {i}', cy: 'Ewch i dudalen rhif {i}' },
              { i: i.toString() },
            )}
            className={twMerge(
              numberClasses,
              hoverClasses,
              focusClasses,
              activeClasses,
              't-page text-magenta-500 underline active:underline border-white',
            )}
          >
            {i}
          </Link>
        )}
      </li>
    );
  };

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
        data-testid="pagination"
      >
        {page !== 1 && totalItems > 0 && (
          <Button
            variant="link"
            href={buildPageHref(router.query, previousPage)}
            as="a"
            iconLeft={<ChevronLeft />}
            data-testid="previous-button"
            className={twMerge(
              nextPrevClasses,
              hoverClasses,
              focusClasses,
              activeClasses,
              't-previous sm:flex-none justify-self-start mt-2 lg:mt-0 pl-2 border-white underline active:underline',
            )}
          >
            {z({ en: 'Previous', cy: 'Blaenorol' })}
          </Button>
        )}

        <ul className="flex items-center justify-center flex-1 min-w-full space-x-1 lg:flex-none lg:min-w-fit">
          {/* MOBILE RENDER */}
          {mobilePages.map((i, index) => renderPageItem(i, index, true))}

          {/* DESKTOP RENDER */}
          <div className="items-center hidden space-x-1 md:flex">
            {desktopPages.map((i, index) => {
              const hideOnDesktopMobile =
                index !== 0 && i !== page && index !== desktopPages.length - 1;
              return renderPageItem(i, index, false, hideOnDesktopMobile);
            })}
          </div>
        </ul>

        {page < totalPages && (
          <Button
            variant="link"
            href={buildPageHref(router.query, nextPage)}
            as="a"
            className={twMerge(
              nextPrevClasses,
              hoverClasses,
              focusClasses,
              activeClasses,
              'order-4 justify-self-end t-next pr-2 border-white underline active:underline',
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
