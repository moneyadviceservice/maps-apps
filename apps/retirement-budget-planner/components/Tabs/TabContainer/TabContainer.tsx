import React from 'react';

import { twMerge } from 'tailwind-merge';

import {
  containerClassnames,
  mainContainerClassnames,
} from '../../../lib/constants/styles/tabs.const';
import { Tab, TabContainerProps } from '../../../lib/types/tabs.type';
import { TabHeader } from '../TabHeader/TabHeader';

export const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  activeTabId,
  enabledTabCount,
  headerClassNames,
  children,
  handleTabClick,
}) => {
  if (!tabs || tabs.length === 0) return null;

  return (
    <div className={mainContainerClassnames}>
      <div
        role="tablist"
        aria-label="Navigation menu"
        className={twMerge(containerClassnames, headerClassNames)}
      >
        {tabs.map((tab: Tab, index: number) => (
          <TabHeader
            key={tab.tabName}
            tab={tab}
            index={index}
            enabledTabCount={enabledTabCount}
            activeTabId={activeTabId}
            onClick={handleTabClick}
          />
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${activeTabId}`}
        aria-labelledby={`tab-${activeTabId}`}
      >
        {children}
      </div>
    </div>
  );
};
