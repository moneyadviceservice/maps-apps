import { ReactNode } from 'react';

import { PAGES_NAMES } from 'lib/constants/pageConstants';

import { SummaryType } from './summary.type';
import { Tab } from './tabs.type';

export type RetirementBudgetPlannerPageProps = {
  children?: ReactNode;
  title?: string;
  pageTitle: string;
  tabName: PAGES_NAMES;
  isEmbedded?: boolean;
  summaryData?: SummaryType;
  sessionId?: string | null;
  error?: string | null;
};

export type NavigationDataProps = {
  navTabsData: Tab[];
  initialActiveTabId: string;
  initialEnabledTabCount: number;
};
export type DataProps = {
  [keys: string]: string;
};

export type CachedDataProps = {
  pageData: Record<string, string>;
  fieldGroupNames: RetirementFieldTypes[];
  partnerNames?: string[];
};

export type RetirementBudgetPlannerContentProps = {
  description?: ReactNode;
};

export type PageContentType = {
  step: number;
  partnerName: string;
  content: RetirmentContentType[];
};

export type AddionalGroupFieldsType = {
  section: string;
  items: RetirementGroupFieldType;
};

export type RetirementGroupFieldType = {
  index: number;
  inputLabelName?: string;
  moneyInputName: string;
  frequencyName: string;
  labelText?: string;
  moreInfo?: ReactNode;
};

export type RetirmentContentType = {
  sectionName: string;
  sectionTitle: string;
  sectionDescription?: ReactNode;
  addButtonLabel?: string;
};

export type RetirementFieldTypes = {
  sectionName: string;
  maxItems: number;
  enableRemove: boolean;
  items: RetirementGroupFieldType[];
};

export type FrequencyType = {
  text: string;
  label: string;
  value: number;
};

export type ServerSideProps = RetirementBudgetPlannerPageProps &
  NavigationDataProps &
  CachedDataProps;
