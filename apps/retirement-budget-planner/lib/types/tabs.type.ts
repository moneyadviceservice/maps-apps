import { ReactNode } from 'react';

export interface Tab {
  tabName: string;
  title: string;
  step: number;
}

export interface TabContainerProps {
  tabs: Tab[];
  tabName: string;
  initialActiveTabId?: string;
  iniitialEnabledTabCount?: number;
  headerClassNames?: string;
  children: ReactNode;
}
