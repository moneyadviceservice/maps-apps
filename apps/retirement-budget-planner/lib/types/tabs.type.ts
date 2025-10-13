import { ReactNode } from 'react';

import { PAGES_NAMES } from 'lib/constants/pageConstants';

export interface Tab {
  tabName: string;
  title: string;
  step: number;
}

export interface TabContainerProps {
  tabs: Tab[];
  tabName: PAGES_NAMES;
  initialActiveTabId?: string;
  iniitialEnabledTabCount?: number;
  headerClassNames?: string;
  children: ReactNode;
}
