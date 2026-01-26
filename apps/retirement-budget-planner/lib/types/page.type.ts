import { ReactNode } from 'react';

import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { ErrorMap } from 'lib/util/aboutYou/aboutYou';

import { Partner } from './aboutYou';
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
  onContinueClick?: (partners: Partner) => Promise<boolean>;
  errorDetails?: ErrorMap | null;
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
  pageData: Record<string, string> | Partner[];
  fieldGroupNames: RetirementFieldTypes[];
  partnerNames?: string[];
};

export type RetirementBudgetPlannerContentProps = {
  description?: ReactNode;
};

export type PageContentType = {
  step: number;
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
  labelPlaceholder?: string;
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
