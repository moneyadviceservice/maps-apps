import { ReactNode } from 'react';

import { FREQUNCY_KEYS, PAGES_NAMES } from 'lib/constants/pageConstants';
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
  dynamicIndexesArray: Record<string, Record<string, number[]>> | undefined;
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

export type BasicGroupFieldType = {
  index: number;
  moneyInputName: string;
  frequencyName: string;
  defaultFrequency: FREQUNCY_KEYS;
  inputLabelName?: string;
};

export type RetirementGroupFieldType = BasicGroupFieldType & {
  enableRemove?: boolean;
  labelText?: string;
  labelPlaceholder?: string;
  infoType?: 'text' | 'html';
  moreInfo?: ReactNode;
};

export type RetirmentContentType = {
  sectionName: string;
  sectionTitle: string;
  sectionDescription?: ReactNode;
  addButtonLabel?: string;
};

export type FieldsType = {
  field: string;
  items: BasicGroupFieldType[] | RetirementGroupFieldType[];
  isDynamic: boolean;
  maxItems?: number;
};

export type RetirementFieldTypes = {
  sectionName: string;
  fields: FieldsType[];
};

export type CostsFieldTypes = {
  sectionName: string;
  items: BasicGroupFieldType[] | RetirementGroupFieldType[];
};

export type FrequencyType = {
  text: string;
  key: string;
  value: number;
};

export type ServerSideProps = RetirementBudgetPlannerPageProps &
  NavigationDataProps &
  CachedDataProps;
