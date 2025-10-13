import { twMerge } from 'tailwind-merge';

import {
  activeClassnames,
  commonClassNames,
  disabledClassnames,
  enabledClassnames,
  focusClassNames,
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
  const isActive = tab.tabName === activeTabId;

  const tabIndex = isEnabled ? 0 : -1;

  const tabClassName = twMerge(
    commonClassNames,
    focusClassNames,
    !isEnabled ? disabledClassnames : enabledClassnames,
  );
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    if (isEnabled) {
      onClick(tab.tabName, index);
    }
  };

  return (
    <div className={twMerge(isActive && activeClassnames, 'pb-3')}>
      <button
        key={tab.tabName}
        onClick={handleClick}
        className={tabClassName}
        role="tab"
        aria-selected={isActive}
        tabIndex={tabIndex}
        formAction={`/api/submit?stepName=${tab.tabName}&stepsEnabled=${enabledTabCount}`}
      >
        {tab.title}
      </button>
    </div>
  );
};
