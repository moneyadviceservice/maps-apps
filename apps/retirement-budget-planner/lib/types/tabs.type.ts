import { ReactNode } from 'react';

export interface Tab {
  tabName: string;
  title: string;
  step: number;
}

export interface TabContainerProps {
  tabs: Tab[];
  activeTabId: string;
  enabledTabCount: number;
  children: ReactNode;
  handleTabClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    tabId: string,
    tabIndex: number,
  ) => void;
  headerClassNames?: string;
}
