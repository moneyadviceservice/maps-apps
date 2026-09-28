import { ReactNode } from 'react';

export type FormContentAnlyticsData = {
  pageName: string;
  pageTitle: string;
  toolName: string;
  stepNames: string[] | string;
  categoryLevels?: string[];
};

export enum DataPath {
  MidLifeMot = 'midlife-mot',
  CreditOptions = 'credit-options',
  PensionType = 'pension-type',
  BabyCostCalculator = 'baby-cost-calculator',
  WorkplacePensionCalculator = 'workplace-pension-calculator',
  CashInChunksCalculator = 'cash-in-chunks-calculator',
  TakeWholePot = 'take-whole-pot',
  GuaranteedIncomeEstimator = 'guaranteed-income-estimator',
  LeavePotUntouched = 'leave-pot-untouched',
  AjustableIncomeEstimator = 'ajustable-income-estimator',
  SavingsCalculator = 'savings-calculator',
  BabyMoneyTimeline = 'baby-money-timeline',
}

export enum UrlPath {
  MidLifeMot = 'mid-life-mot',
  CreditOptions = 'credit-options',
  PensionType = 'pension-type',
  BabyCostCalculator = 'baby-cost-calculator',
  WorkplacePensionCalculator = 'workplace-pension-calculator',
  CashInChunksCalculator = 'cash-in-chunks-calculator',
  TakeWholePot = 'take-whole-pot',
  GuaranteedIncomeEstimator = 'guaranteed-income-estimator',
  LeavePotUntouched = 'leave-pot-untouched',
  AjustableIncomeEstimator = 'ajustable-income-estimator',
  SavingsCalculator = 'savings-calculator',
  BabyMoneyTimeline = 'baby-money-timeline',
}

export type Group = {
  title: string;
  group: string;
  descritionScoreOne?: string;
  descritionScoreTwo?: string;
  descritionScoreThree?: string;
};

export type Links = {
  title: string;
  link: string;
  type: string;
  description?: string;
};

export type TranslationGroup = {
  readonly en: ReactNode;
  readonly cy: ReactNode;
};

export type TranslationGroupString = {
  readonly en: string;
  readonly cy: string;
};

export type Condition = {
  question: string;
  answer: string;
  arithmeticOperator?: string;
};
