import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import {
  containerClassnames,
  mainContainerClassnames,
} from '../../../lib/constants/styles/tabs.const';
import { Tab, TabContainerProps } from '../../../lib/types/tabs.type';
import {
  findTabIndex,
  hasTabExist,
  isNextTabToEnable,
} from '../../../lib/util/tabs/tabs';
import { TabContent } from '../TabContent/TabContent';
import { TabHeader } from '../TabHeader/TabHeader';

export const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  initialActiveTabId,
  iniitialEnabledTabCount = 1,
}) => {
  const router = useRouter();
  const [activeTabId, setActiveTabId] = useState<string>(
    initialActiveTabId || tabs[0]?.id || '',
  );
  const [enabledTabCount, setEnabledTabCount] = useState<number>(
    iniitialEnabledTabCount,
  );

  useEffect(() => {
    const tabIdFromQuery = router.query.tab as string;

    if (hasTabExist(tabs, tabIdFromQuery)) {
      const index = findTabIndex(tabs, tabIdFromQuery);
      setActiveTabId(tabIdFromQuery);
      setEnabledTabCount(Math.max(enabledTabCount, index + 1));
    }
  }, [router.query.tab, router.query.last, tabs, enabledTabCount]);

  if (!tabs || tabs.length === 0) return null;

  const handleTabClick = (tabId: string, tabIndex: number) => {
    if (tabIndex < enabledTabCount) {
      setActiveTabId(tabId);
      router.push(`/?tab=${tabId}`, undefined, {
        shallow: true,
      });
    }
  };

  const handleEnableNext = (nextTabId: string) => {
    const nextIndex = findTabIndex(tabs, nextTabId);
    if (isNextTabToEnable(nextIndex, enabledTabCount)) {
      setEnabledTabCount(nextIndex + 1);
      setActiveTabId(nextTabId);
      router.push(`/?tab=${nextTabId}`, undefined, {
        shallow: true,
      });
    }
  };

  return (
    <div className={mainContainerClassnames}>
      <div role="tablist" className={containerClassnames}>
        {tabs.map((tab: Tab, index: number) => (
          <TabHeader
            key={tab.id}
            tab={tab}
            index={index}
            enabledTabCount={enabledTabCount}
            activeTabId={activeTabId}
            onClick={handleTabClick}
          />
        ))}
      </div>
      <TabContent
        tabs={tabs}
        activeTabId={activeTabId}
        onEnableNext={handleEnableNext}
      />
    </div>
  );
};
