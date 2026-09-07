import useTranslation from '@maps-react/hooks/useTranslation';
import { PAGES_NAMES, PAGES_NAMES_EXTRA } from '../lib/constants/pageConstants';
import { Tab } from '../lib/types';

export const TAB_NAMES: Tab[] = [
  {
    step: 1,
    tabName: PAGES_NAMES.ABOUTYOU,
  },
  {
    step: 2,
    tabName: PAGES_NAMES.INCOME,
  },
  {
    step: 3,
    tabName: PAGES_NAMES.ESSENTIALS,
  },
  {
    step: 4,
    tabName: PAGES_NAMES.SUMMARY,
  },
];

export const getTabTitle = (
  tabName: string,
  t: ReturnType<typeof useTranslation>['t'],
): string => {
  return t(`tabs.${tabName}`, undefined, '');
};

/**
 * Get the full page title for the supplied tab and language
 *
 * @param options - Options object
 * @param options.pageTitle - Custom page title, overriding the translated tabName
 * @param options.tabName - The name of the tab
 * @param options.t - The t function from useTranslation
 * @returns Translated page title string in the format "{tabTitle} | Retirement budget planner | MoneyHelper Tools"
 */
export const getFullPageTitle = ({
  pageTitle,
  tabName,
  t,
}: {
  pageTitle?: string;
  tabName: PAGES_NAMES | PAGES_NAMES_EXTRA | string;
  t: ReturnType<typeof useTranslation>['t'];
}): string => {
  const tabTitle = pageTitle || getTabTitle(tabName, t) || '';

  return [tabTitle, t('pageTitle', undefined, ''), t('moneyHelperTools')]
    .filter(Boolean)
    .join(' | ');
};

/**
 * Locales
 */

export const locales = ['en', 'cy'] as const;

export type Locale = (typeof locales)[number];

export const isStringLocale = (value: string): value is Locale => {
  return locales.includes(value as Locale);
};
