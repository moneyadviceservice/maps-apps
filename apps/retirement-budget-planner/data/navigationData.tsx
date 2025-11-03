import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { Tab } from 'lib/types';

export const TAB_NAMES: Tab[] = [
  {
    step: 1,
    title: 'About you',
    tabName: PAGES_NAMES.ABOUTYOU,
  },
  {
    step: 2,
    title: 'Expected retirement income',
    tabName: PAGES_NAMES.INCOME,
  },
  {
    step: 3,
    title: 'Essential outgoings',
    tabName: PAGES_NAMES.ESSENTIALS,
  },
  {
    step: 4,
    title: 'Summary',
    tabName: PAGES_NAMES.SUMMARY,
  },
];
