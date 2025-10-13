import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { twMerge } from 'tailwind-merge';

import { useSessionId } from '../../../context/SessionContextProvider';
import {
  containerClassnames,
  mainContainerClassnames,
} from '../../../lib/constants/styles/tabs.const';
import { Tab, TabContainerProps } from '../../../lib/types/tabs.type';
import { findTabIndex, hasTabExist } from '../../../lib/util/tabs/tabs';
import { TabHeader } from '../TabHeader/TabHeader';

export const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  tabName,
  initialActiveTabId,
  iniitialEnabledTabCount = 1,
  headerClassNames,
  children,
}) => {
  const router = useRouter();
  const sessionId = useSessionId();
  const [activeTabId, setActiveTabId] = useState<string>(
    initialActiveTabId || tabs[0]?.tabName || '',
  );

  const [enabledTabCount, setEnabledTabCount] = useState<number>(
    iniitialEnabledTabCount,
  );

  useEffect(() => {
    if (hasTabExist(tabs, tabName)) {
      const index = findTabIndex(tabs, tabName);
      setActiveTabId(tabName);
      setEnabledTabCount(Math.max(enabledTabCount, index + 1));
    }
  }, [router.query.tabName, router.query.last, tabs, enabledTabCount, tabName]);

  if (!tabs || tabs.length === 0) return null;

  const handleTabClick = (tabId: string, tabIndex: number) => {
    if (tabIndex < enabledTabCount) {
      setActiveTabId(tabId);

      router.push(`/${router.query?.language}/${tabId}?sessionId=${sessionId}`);
    }
  };

  return (
    <div className={mainContainerClassnames}>
      <div
        role="tablist"
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
      <div>{children}</div>
    </div>
  );
};
