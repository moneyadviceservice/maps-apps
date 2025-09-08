import { ReactNode } from 'react';

import { Tab } from './tabs.type';

export type RetirementBudgetPlannerPageProps = {
  children?: ReactNode;
  title: string;
  pageTitle: string;
  tabName: string;
  isEmbedded?: boolean;
};

export type NavigationDataProps = {
  navTabsData: Tab[];
  initialActiveTabId: string;
  initialEnabledTabCount: number;
};
export type DataProps = {
  [keys: string]: string;
};

export type AdditionalContentProps = {
  [keys: string]: RetirementIncomeGroupFieldType;
};
export type CachedDataProps = {
  pageData: Record<string, string>;
  fieldGroupNames: RetirementIncomeFieldTypes[];
  partners: string[];
};

export type RetirementBudgetPlannerContentProps = {
  description?: ReactNode;
};

export type PageContentType = {
  step: number;
  partnerName: string;
  content: RetirmentIncomeContentType[];
};

export type AddionalGroupFieldsType = {
  section: string;
  items: RetirementIncomeGroupFieldType;
};

export type RetirementIncomeGroupFieldType = {
  index: number;
  inputLabelName?: string;
  moneyInputName: string;
  frequencyName: string;
};

export type RetirmentIncomeContentType = {
  sectionName: string;
  sectionTitle: string;
  sectionDescription?: ReactNode;
  addButtonLabel?: string;
};

export type RetirementIncomeFieldTypes = {
  sectionName: string;
  maxItems: number;
  enableRemove: boolean;
  items: RetirementIncomeGroupFieldType[];
};
