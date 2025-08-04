import { ReactNode } from 'react';

export interface Tab {
  id: string;
  title: string;
  content: ReactNode;
}

export interface TabContainerProps {
  tabs: Tab[];
  initialActiveTabId?: string;
  iniitialEnabledTabCount?: number;
}

export interface TabContentExampleProps {
  tabIndex: number;
  onEnableNext: (nextTabId: string) => void;
  isLastTab: boolean;
  nextTabId?: string;
}
