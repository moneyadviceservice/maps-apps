import Link from 'next/link';

import { twMerge } from 'tailwind-merge';

const commonClasses =
  'py-2 mb-3 sm:mb-0 text-sm flex max-sm:w-full max-sm:text-center max-sm:flex max-sm:justify-center sm:text-base max-sm:border-b-4 border-b-2 sm:border-b-4 border-b-gray-350 snap-start leading-4 font-normal text-pink-800 underline whitespace-nowrap';
const selectedClasses =
  'font-bold text-blue-700 no-underline border-b-4 border-b-blue-700 hover:text-blue-700 hover:no-underline hover:border-b-blue-700 hover:border-b-4 active:bg-transparent';
const hoverClasses =
  'hover:no-underline hover:border-b-pink-800 hover:border-b-4 hover:active:underline hover:active:text-gray-800 hover:active:decoration-gray-800 hover:active:border-b-gray-800 hover:active:border-b-2 sm:hover:active:border-b-4';
const activeClasses =
  'active:underline active:text-gray-800 active:decoration-gray-800 active:border-b-gray-800 active:border-b-2 sm:active:border-b-4 active:bg-transparent active:hover:underline active:hover:text-gray-800 active:hover:decoration-gray-800 active:hover:border-b-gray-800 active:hover:border-b-2 sm:active:hover:border-b-4 active:focus-visible:bg-transparent active:focus-visible:pb-2 active:focus-visible:underline active:focus-visible:text-gray-800 active:focus-visible:decoration-gray-800 active:focus-visible:border-b-gray-800 active:focus-visible:border-b-2 sm:active:focus-visible:border-b-4 active:hover:focus-visible:bg-transparent active:hover:focus-visible:pb-2 active:hover:focus-visible:underline active:hover:focus-visible:text-gray-800 active:hover:focus-visible:decoration-gray-800 active:hover:focus-visible:border-b-gray-800 active:hover:focus-visible:border-b-2 sm:active:hover:focus-visible:border-b-4';
const focusClasses =
  'group focus-visible:bg-yellow-400 max-sm:focus-visible:py-2 focus-visible:pb-0.5 sm:focus-visible:pb-1 focus-visible:text-gray-800 focus-visible:no-underline focus-visible:border-b-blue-700 max-sm:focus-visible:border-b-4 max-sm:focus-visible:shadow-[inset_0_-4px_0_0_theme(colors.blue.700)] sm:focus-visible:border-b-8 sm:focus-visible:shadow-none focus-visible:outline-none';
const labelClasses = 'px-[3px]';

export const tabListItemClasses =
  'sm:mr-6 md:mr-12 last:mr-0 relative z-10 flex-none max-sm:w-full max-sm:text-center max-sm:flex max-sm:justify-center';

export type TabLinkProps = {
  label: string;
  href: string;
  isActive?: boolean;
  testId?: string;
};

export const TabLink = ({
  label,
  href,
  isActive = false,
  testId,
}: TabLinkProps) => (
  <Link
    className={twMerge(
      commonClasses,
      isActive && selectedClasses,
      !isActive && hoverClasses,
      focusClasses,
      activeClasses,
    )}
    {...(isActive ? { 'aria-current': 'page' } : {})}
    href={href}
    data-testid={testId}
  >
    <span className={labelClasses}>{label}</span>
  </Link>
);
