import React from 'react';

import { Tab } from '../../../lib/types/tabs.type';
import {
  findNextTabId,
  findTabIndex,
  getTabContent,
  isEndOfTabs,
} from '../../../lib/util/tabs/tabs';

export type TabContentProps = {
  tabs: Tab[];
  activeTabId: string;
  onEnableNext: (tabId: string) => void;
};

type ActiveContentProps = {
  onEnableNext: (tabId: string) => void;
  isLastTab: boolean;
  tabIndex: number;
  nextTabId: string;
};
export const TabContent: React.FC<TabContentProps> = ({
  tabs,
  activeTabId,
  onEnableNext,
}) => {
  const activeTabContent = getTabContent(tabs, activeTabId);

  if (!activeTabContent) return null;

  const tabIndex = findTabIndex(tabs, activeTabId);
  const nextTabId = findNextTabId(tabs, activeTabId);
  const isLastTab = isEndOfTabs(tabs, activeTabId);

  return (
    <div className="mb-6">
      {React.cloneElement(
        activeTabContent as React.ReactElement<ActiveContentProps>,
        {
          onEnableNext,
          isLastTab,
          tabIndex,
          nextTabId,
        },
      )}
    </div>
  );
};
