import { twMerge } from 'tailwind-merge';

import useTranslation from '@maps-react/hooks/useTranslation';

import { getTabTitle } from '../../../data/navigationData';
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
  onClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    tabId: string,
    tabIndex: number,
  ) => void;
};

export const TabHeader = ({
  tab,
  index,
  enabledTabCount,
  activeTabId,
  onClick,
}: TabHeaderProps) => {
  const { t } = useTranslation();
  const isEnabled = index < enabledTabCount;
  const isActive = tab.tabName === activeTabId;

  const tabIndex = isEnabled ? 0 : -1;

  const tabClassName = twMerge(
    commonClassNames,
    isActive ? activeClassnames : '',
    focusClassNames,
    !isEnabled ? disabledClassnames : enabledClassnames,
  );
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    if (isEnabled) {
      onClick(event, tab.tabName, index);
    }
  };

  return (
    <button
      role="tab"
      aria-controls={`panel-${tab.tabName}`}
      id={`tab-${tab.tabName}`}
      aria-selected={isActive}
      tabIndex={tabIndex}
      onClick={handleClick}
      className={twMerge(
        tabClassName,
        isActive && 'border-b-4 border-blue-700',
        'pb-3',
      )}
      data-testid={tab.tabName}
      formAction={`/api/submit?stepName=${tab.tabName}&stepsEnabled=${enabledTabCount}`}
    >
      {getTabTitle(tab.tabName, t)}
    </button>
  );
};
