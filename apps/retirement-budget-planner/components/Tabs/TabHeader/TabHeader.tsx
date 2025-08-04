import Link from 'next/link';

import { twMerge } from 'tailwind-merge';

import {
  activeClassnames,
  commonClassNames,
  disabledClassnames,
  enabledClassnames,
  focusClassNames,
  notActiveClassnames,
} from '../../../lib/constants/styles/tabs.const';
import { Tab } from '../../../lib/types/tabs.type';

type TabHeaderProps = {
  tab: Tab;
  index: number;
  enabledTabCount: number;
  activeTabId: string;
  onClick: (tabId: string, tabIndex: number) => void;
};

export const TabHeader = ({
  tab,
  index,
  enabledTabCount,
  activeTabId,
  onClick,
}: TabHeaderProps) => {
  const isEnabled = index < enabledTabCount;
  const isActive = tab.id === activeTabId;
  const tabHref = `/?tab=${tab.id}`;
  const tabIndex = isEnabled ? 0 : -1;
  const tabClassName = twMerge(
    commonClassNames,
    focusClassNames,
    isActive ? activeClassnames : notActiveClassnames,
    !isEnabled ? disabledClassnames : enabledClassnames,
  );
  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (isEnabled) {
      onClick(tab.id, index);
    }
  };
  return (
    <div key={tab.id} className="flex-1">
      <Link
        key={tab.id}
        href={tabHref}
        onClick={handleClick}
        className={tabClassName}
        role="tab"
        aria-selected={isActive}
        tabIndex={tabIndex}
      >
        {tab.title}
      </Link>
    </div>
  );
};
