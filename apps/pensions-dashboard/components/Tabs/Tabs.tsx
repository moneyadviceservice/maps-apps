import { useRouter } from 'next/router';

import { twMerge } from 'tailwind-merge';

import useTranslation from '@maps-react/hooks/useTranslation';

import { TabLink, tabListItemClasses } from './TabLink';

const listWrapperClasses =
  'flex flex-wrap mt-7 md:mt-10 mb-8 max-sm:mb-1 max-sm:mt-7 sm:flex max-sm:grid max-sm:grid-cols-2 max-sm:grid-rows-2 relative';
const listBaselineClasses =
  'sm:after:content-[""] sm:after:block sm:after:w-full sm:after:h-[4px] sm:after:bg-gray-350 sm:after:absolute sm:after:bottom-0 sm:z-0';

type TabsProps = {
  className?: string;
  testId?: string;
};

export const Tabs = ({ className, testId = 'tabs' }: TabsProps) => {
  const router = useRouter();
  const { t, locale } = useTranslation();

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
    <nav aria-label={t('pages.pension-details.navigation-label')}>
      <ul
        data-testid={testId}
        className={twMerge(listWrapperClasses, listBaselineClasses, className)}
      >
        {tabs.map((tab) => {
          const isActive = router.pathname.includes(
            `pension-details/` + tab.href,
          );

          return (
            <li key={tab.href} className={tabListItemClasses}>
              <TabLink
                label={tab.label}
                href={`/${locale}/pension-details/${tab.href}?focus=details-heading`}
                isActive={isActive}
                testId={`tab-${tab.href}`}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
