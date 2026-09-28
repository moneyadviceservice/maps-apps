import type { ComponentProps } from 'react';

import { PAGES_NAMES, PAGES_NAMES_EXTRA } from 'lib/constants/pageConstants';
import { getStepNumberFromTabName } from 'lib/util/pageFilter/pageFilter';

import { Analytics } from '@maps-react/core/components/Analytics/Analytics';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';

const lastStep = Object.values(PAGES_NAMES).length;

export const useRbpAnalytics = (tabName: PAGES_NAMES | PAGES_NAMES_EXTRA) => {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const { addEvent } = useAnalytics();

  const toolStep = getStepNumberFromTabName(tabName) ?? '';

  const pageTitleBase = t('pageTitle');
  const pageTitleBaseEn = tEn('pageTitle');

  const tabNameFull = t(`tabs.${tabName}`, undefined, '') || tabName;
  const tabNameFullEn = tEn(`tabs.${tabName}`, undefined, '') || tabName;

  // e.g. 'retirement-budget-planner--about-you' (always in English)
  const pageName = ['retirement-budget-planner', tabName]
    .filter(Boolean)
    .join('--');

  // e.g. 'Retirement budget planner -- About you' / 'Cynlluniwr cyllideb ar gyfer ymddeoliad -- Amdanoch chi'
  const pageTitle = [pageTitleBase, tabNameFull].filter(Boolean).join(' -- ');

  // e.g. 'Retirement Budget Planner -- About you' (always in English)
  const stepName = [pageTitleBaseEn, tabNameFullEn]
    .filter(Boolean)
    .join(' -- ');

  const analyticsData = {
    page: {
      pageName,
      pageTitle,
      categoryLevels: ['Pensions & retirement', 'pensions explained'],
      lang: locale,
      site: 'moneyhelper',
      pageType: 'tool page',
    },
    tool: {
      toolName: 'Retirement Budget Planner',
      toolCategory: 'Complex Tool',
      toolStep,
      stepName,
    },
  } satisfies ComponentProps<typeof Analytics>['analyticsData'];

  return {
    lastStep,
    analyticsData,
    addEvent,
  };
};
