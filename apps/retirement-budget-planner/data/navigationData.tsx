import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { Tab } from 'lib/types';

export const TAB_NAMES: Tab[] = [
  {
    step: 1,
    title: 'About Us',
    tabName: PAGES_NAMES.ABOUTUS,
  },
  {
    step: 2,
    title: 'Retirement',
    tabName: 'retirement',
  },
  {
    step: 3,
    title: 'Household bills',
    tabName: 'household-bills',
  },
  {
    step: 4,
    title: 'Personal outgoing',
    tabName: 'personal-outgoing',
  },
  {
    step: 5,
    title: 'Summary',
    tabName: PAGES_NAMES.SUMMARY,
  },
];
