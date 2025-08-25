import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { Tab } from 'lib/types';

/**
 * Get the tab name either from params or from defined list of page names
 * @param url current url
 * @param params params that include dynamic pages name
 * such us {language: 'en', tabName: 'retirement'}
 * @returns the current tab name
 */

export const getTabNameFromParams = (
  url: string | undefined,
  params: Record<string, string>,
) => {
  if (!url) {
    throw new Error('Query url is missing');
  }
  if (url?.includes(PAGES_NAMES.ABOUTUS)) return PAGES_NAMES.ABOUTUS;
  else if (url?.includes(PAGES_NAMES.SUMMARY)) return PAGES_NAMES.SUMMARY;
  else return params?.tabName || '';
};

/**
 * Get the current page title or empty string if the tabName is not found
 * @param tabs list of Tab details
 * @param tabName current page tabName
 * @returns the current page title
 */
export const getPageTitle = (tabs: Tab[], tabName: string) => {
  return (
    tabs.filter((t) => {
      return t.tabName === tabName;
    })[0]?.title || ''
  );
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
    tabs.filter((tab, i) => {
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
export const getInitialTabData = (
  tabs: Tab[],
  tabName: string,
  stepsEnabled: string | undefined,
) => {
  let initialActiveTabId = tabs[0].tabName,
    initialEnabledTabCount = 1;
  if (tabName && tabs.some((tab) => tab.tabName === tabName)) {
    initialActiveTabId = tabName;

    initialEnabledTabCount = getInitialTabCount(tabs, stepsEnabled, tabName);
  }

  return {
    initialActiveTabId,
    initialEnabledTabCount,
  };
};
