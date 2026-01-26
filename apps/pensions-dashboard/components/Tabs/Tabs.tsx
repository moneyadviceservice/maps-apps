import Link from 'next/link';
import { useRouter } from 'next/router';

import { twMerge } from 'tailwind-merge';

import useTranslation from '@maps-react/hooks/useTranslation';

type TabsProps = {
  className?: string;
  testId?: string;
};

export const Tabs = ({ className, testId = 'tabs' }: TabsProps) => {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const listItemClasses =
    'sm:mr-6 md:mr-12 last:mr-0 relative z-10 flex-none max-sm:w-full max-sm:text-center max-sm:flex max-sm:justify-center';
  const commonClasses =
    'py-2 mb-3 sm:mb-0 text-sm flex max-sm:w-full max-sm:text-center max-sm:flex max-sm:justify-center sm:text-base border-b-2 sm:border-b-4 border-gray-350 snap-start leading-4 font-bold text-pink-800 underline whitespace-nowrap';
  const activeClasses = 'border-b-4 border-blue-700 text-blue-700 no-underline';
  const hoverClasses = 'hover:bg-gray-100 hover:no-underline';
  const focusClasses =
    'focus:bg-yellow-400 focus:outline-none focus:text-blue-700 focus:border-purple-800 focus:no-underline active:bg-yellow-400';

  const tabs = [
    {
      href: 'your-pension-summary',
      label: t('pages.pension-details.header.summary'),
    },
    {
      href: 'pension-income-and-values',
      label: t('pages.pension-details.header.income-and-values'),
    },
    {
      href: 'about-this-pension',
      label: t('pages.pension-details.header.about-this-pension'),
    },
    {
      href: 'contact-pension-provider',
      label: t('pages.pension-details.header.contact-provider'),
    },
  ];

  return (
    <ul
      data-testid={testId}
      className={twMerge(
        'flex flex-wrap mt-7 md:mt-10 mb-8 max-sm:mb-1 max-sm:mt-7 sm:flex max-sm:grid max-sm:grid-cols-2 max-sm:grid-rows-2 relative',
        'sm:after:content-[""] sm:after:block sm:after:w-full sm:after:h-[4px] sm:after:bg-gray-350 sm:after:absolute sm:after:bottom-0 sm:z-0',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = router.pathname.includes(
          `pension-details/` + tab.href,
        );
        return (
          <li key={tab.href} className={listItemClasses}>
            <Link
              className={twMerge(
                commonClasses,
                isActive && activeClasses,
                hoverClasses,
                focusClasses,
              )}
              {...(isActive ? { 'aria-current': 'page' } : {})}
              href={`/${locale}/pension-details/${tab.href}?focus=details-heading`}
              data-testid={`tab-${tab.href}`}
            >
              {tab.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
