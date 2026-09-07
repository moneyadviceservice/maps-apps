import type { ComponentProps, ReactNode } from 'react';

import { FREQUENCY_KEYS, PAGES_NAMES } from 'lib/constants/pageConstants';
import { ErrorMap } from 'lib/util/aboutYou/aboutYou';
import type { ParsedUrlQuery } from 'querystring';

import { Analytics } from '@maps-react/core/components/Analytics';
import { MoneyInputFrequencyGroupProps } from '@maps-react/pension-tools/components/MoneyInputFrequencyGroup';

import { Partner } from './aboutYou';
import { SummaryType } from './summary.type';
import { Tab } from './tabs.type';

export type RetirementBudgetPlannerPageProps = {
  children?: ReactNode;
  title?: string;
  pageTitle?: string;
  tabName: PAGES_NAMES;
  isEmbedded?: boolean;
  summaryData?: SummaryType;
  sessionId?: string | null;
  error?: string | null;
  onContinueClick?: (partners: Partner) => Promise<boolean>;
  errorDetails?: ErrorMap | null;
  useInformizely?: boolean;
  analyticsErrors?: ComponentProps<typeof Analytics>['errors'];
  query?: ParsedUrlQuery;
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
  content: RetirementContentType[];
};

export type AddionalGroupFieldsType = {
  section: string;
  items: RetirementGroupFieldType;
};

export type BasicGroupFieldType = Partial<MoneyInputFrequencyGroupProps> & {
  index: number;
  moneyInputName: string;
  frequencyName: string;
  defaultFrequency: FREQUENCY_KEYS;
  inputLabelName?: string;
};

export type RetirementGroupFieldType = BasicGroupFieldType & {
  enableRemove?: boolean;
  labelPlaceholder?: string;
  infoType?: 'text' | 'html';
  moreInfo?: ReactNode;
};

export type RetirementContentType = {
  sectionName: string;
  sectionTitle: string;
  sectionDescription?: string;
  addButtonLabel?: string;
  removeButtonLabel?: string;
};

export type FieldsType = {
  field: string;
  items: BasicGroupFieldType[] | RetirementGroupFieldType[];
  isDynamic: boolean;
  maxItems?: number;
  title?: string;
  description?: string;
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
  key: FREQUENCY_KEYS;
  value: number;
};

export type FrequencyOptionType = FrequencyType & {
  text: string;
};

export type SummaryCachedData = {
  partner: Partner;
  costs: Record<string, string>;
  income: Record<string, string>;
  divisor: string;
};

export type ServerSideProps = RetirementBudgetPlannerPageProps &
  NavigationDataProps &
  CachedDataProps;
