import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { Tab } from 'lib/types';

/**
 * Get the tab name either from params or from defined list of page names
 * @param url current url
 * @returns the current tab name
 */

export const getTabNameFromParams = (url: string | undefined) => {
  if (!url) {
    throw new Error('Query url is missing');
  }
  const page = Object.values(PAGES_NAMES).find((v) => url?.includes(v));
  if (page) return page;
  else return PAGES_NAMES.ABOUTYOU;
};

/**
 *
 * @param tabs list of Tab details
 * @param stepsEnabled the highest step number of tab that the user has navigated to
 * @param tabName current page tabName
 * @returns it returns the highest step enabled or current tab step
 */
export const getInitialTabCount = (
  tabs: Tab[],
  stepsEnabled: string | undefined,
  tabName: string,
) => {
  return (
    Number(stepsEnabled) ||
    tabs.filter((tab) => {
      return tab.tabName === tabName;
    })[0].step
  );
};

/**
 *
 * @param tabs list of Tab details
 * @param tabName current page tab name
 * @param stepsEnabled the highest step number of tab that the user has navigated to
 * @returns return the initial data to activate and enable tabs
 */
export const getInitialTabData = (tabs: Tab[], tabName: string) => {
  let initialActiveTabId = tabs[0].tabName;

  if (tabName && tabs.some((tab) => tab.tabName === tabName)) {
    initialActiveTabId = tabName;
  }

  return {
    initialActiveTabId,
  };
};
