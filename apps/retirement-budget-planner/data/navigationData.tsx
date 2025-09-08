import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { Tab } from 'lib/types';
import { Link } from '@maps-react/common/components/Link';
import { Options } from '@maps-react/form/components/Select';

export const TAB_NAMES: Tab[] = [
  {
    step: 1,
    title: 'About you',
    tabName: PAGES_NAMES.ABOUTYOU,
  },
  {
    step: 2,
    title: 'Retirement',
    tabName: PAGES_NAMES.RETIREMENT,
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
