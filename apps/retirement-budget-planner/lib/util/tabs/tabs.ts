import { Tab } from '../../types/tabs.type';
export const findTabIndex = (tabs: Tab[], tabtabName: string) =>
  tabs.findIndex((tab) => tab.tabName === tabtabName);

export const hasTabExist = (tabs: Tab[], tabtabName = '') =>
  tabs.some((tab) => tab.tabName === tabtabName);

export const isNextTabToEnable = (index: number, enabledTabCount: number) =>
  index !== -1 && index >= enabledTabCount;

export const isEndOfTabs = (tabs: Tab[], tabtabName: string) =>
  findTabIndex(tabs, tabtabName) === tabs.length - 1;

export const findNextTabId = (tabs: Tab[], tabId: string) =>
  tabs[findTabIndex(tabs, tabId) + 1]?.tabName;

export const findNextTabtabName = (tabs: Tab[], tabtabName: string) =>
  tabs[findTabIndex(tabs, tabtabName) + 1]?.tabName;

/**
 *
 * @param tabs  a list of Tab elements holding information like name and title for each tab
 * @param currentTabName the name of current active tab
 * @returns the name of the next tab in the navigation
 */
export const findNextStepName = (tabs: Tab[], currentTabName: string) => {
  const step = findStep(tabs, currentTabName);
  return tabs.length > step ? tabs[step].tabName : currentTabName;
};

/**
 *
 * @param tabs  a list of Tab elements holding information like name and title for each tab
 * @param currentTabName the name of current active tab
 * @returns the name of the previous tab in the navigation or landing page
 */
export const findPreviousStep = (tabs: Tab[], tabName: string): string => {
  const step = findStep(tabs, tabName);
  return step - 1 > 0 ? tabs[step - 2].tabName : 'landing';
};

/**
 *
 * @param tabs  a list of Tab elements holding information like name and title for each tab
 * @param currentTabName the name of current active tab
 * @returns the step number of next tab
 */
export const findNextStep = (tabs: Tab[], currentTabName: string) => {
  const step = findStep(tabs, currentTabName);
  return step + 1;
};

/**
 *
 * @param tabs a list of Tab elements holding information like name and title for each tab
 * @param currentTabName the name of current active tab
 * @returns the step number or current tab
 */
export const findStep = (tabs: Tab[], currentTabName: string): number => {
  return (tabs.find((t) => t.tabName === currentTabName)?.step as number) || 1;
};
