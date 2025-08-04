import { Tab } from '../../types/tabs.type';
export const findTabIndex = (tabs: Tab[], tabId: string) =>
  tabs.findIndex((tab) => tab.id === tabId);

export const hasTabExist = (tabs: Tab[], tabId = '') =>
  tabs.some((tab) => tab.id === tabId);

export const isNextTabToEnable = (index: number, enabledTabCount: number) =>
  index !== -1 && index >= enabledTabCount;

export const getTabContent = (tabs: Tab[], tabId: string) =>
  tabs.find((tab) => tab.id === tabId)?.content;

export const isEndOfTabs = (tabs: Tab[], tabId: string) =>
  findTabIndex(tabs, tabId) === tabs.length - 1;

export const findNextTabId = (tabs: Tab[], tabId: string) =>
  tabs[findTabIndex(tabs, tabId) + 1]?.id;
