import { twMerge } from 'tailwind-merge';

import useTranslation from '@maps-react/hooks/useTranslation';

import { getTabTitle } from '../../../data/navigationData';
import { NAV_TYPES } from '../../../lib/constants/pageConstants';
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
  navType?: string;
};

export const TabHeader = ({
  tab,
  index,
  enabledTabCount,
  activeTabId,
  onClick,
  navType,
}: TabHeaderProps) => {
  const { t } = useTranslation();
  const isEnabled = index < enabledTabCount;
  const isActive = tab.tabName === activeTabId;

  // All enabled steps are in the tab order, disabled steps are skipped
  const tabIndex = isEnabled ? 0 : -1;

  const tabClassName = twMerge(
    commonClassNames,
    isActive ? activeClassnames : '',
    focusClassNames,
    isEnabled ? enabledClassnames : disabledClassnames,
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
    <li>
      <button
        id={`tab-${tab.tabName}`}
        aria-current={isActive ? 'step' : undefined}
        tabIndex={tabIndex}
        onClick={handleClick}
        autoFocus={isActive && isEnabled && navType === NAV_TYPES.TAB_CLICK}
        className={twMerge(
          tabClassName,
          isActive && 'border-blue-700 no-underline',
          'pt-4 pb-3',
        )}
        data-testid={tab.tabName}
        formAction={`/api/submit?stepName=${tab.tabName}&stepsEnabled=${enabledTabCount}`}
      >
        {getTabTitle(tab.tabName, t)}
      </button>
    </li>
  );
};
