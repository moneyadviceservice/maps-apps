import React from 'react';

import { twMerge } from 'tailwind-merge';

import {
  containerClassnames,
  mainContainerClassnames,
} from '../../../lib/constants/styles/tabs.const';
import { NAV_TYPES } from '../../../lib/constants/pageConstants';
import { Tab, TabContainerProps } from '../../../lib/types/tabs.type';
import { TabHeader } from '../TabHeader/TabHeader';

export const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  activeTabId,
  enabledTabCount,
  headerClassNames,
  children,
  handleTabClick,
  navType,
}) => {
  if (!tabs || tabs.length === 0) return null;

  return (
    <div className={mainContainerClassnames}>
      <nav aria-label="Progress">
        <ol
          className={twMerge(
            containerClassnames,
            headerClassNames,
            'list-none p-0 m-0',
          )}
        >
          {tabs.map((tab: Tab, index: number) => (
            <TabHeader
              key={tab.tabName}
              tab={tab}
              index={index}
              enabledTabCount={enabledTabCount}
              activeTabId={activeTabId}
              onClick={handleTabClick}
              navType={navType}
            />
          ))}
        </ol>
      </nav>
      <div
        id="tab-content"
        tabIndex={-1}
        className="focus:outline-none"
        autoFocus={navType === NAV_TYPES.CONTINUE || navType === NAV_TYPES.BACK}
      >
        {children}
      </div>
    </div>
  );
};
