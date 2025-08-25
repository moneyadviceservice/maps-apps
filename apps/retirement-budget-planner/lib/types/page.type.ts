import { ReactNode } from 'react';

import { Tab } from './tabs.type';

export type RetirementBudgetPlannerPageProps = {
  children?: ReactNode;
  title: string;
  pageTitle: string;
  tabName: string;
  isEmbedded?: boolean;
};

export type NavigationDataProps = {
  navTabsData: Tab[];
  initialActiveTabId: string;
  initialEnabledTabCount: number;
};

export type RetirementBudgetPlannerContentProps = {
  description?: ReactNode;
};
