import useTranslation from '@maps-react/hooks/useTranslation';
import { PAGES_NAMES } from '../lib/constants/pageConstants';
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
  return t(`tabs.${tabName}`);
};
