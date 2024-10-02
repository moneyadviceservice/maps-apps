import { ReactNode } from 'react';

export type Question = {
  questionNbr: number;
  group: string;
  definition?: string | ReactNode;
  title: string;
  type: string;
  subType?: string;
  target?: string;
  description?: string | ReactNode;
  answers: Answer[];
  inputProps?: {
    maxLimit?: number;
    labelValue?: string;
  };
  errors?: Record<string, string | ReactNode>;
};

export type Answer = {
  text: string;
  subtext?: ReactNode;
  score?: number;
  unselectedScore?: number;
  clearAll?: boolean;
  showLinksIfSelected?: boolean;
  links?: Links[];
  unselectedAnswerLinks?: Links[];
};

export type Links = {
  title: string;
  link: string;
  type: string;
  description?: string;
};

export type ErrorType = {
  question: number;
  message: string;
};

export type FormContentAnlyticsData = {
  pageName: string;
  pageTitle: string;
  toolName: string;
  stepNames: string[] | string;
  categoryLevels?: string[];
};

export enum DataPath {
  MidLifeMot = 'midlife-mot',
  CreditRejection = 'credit-rejection',
  CreditOptions = 'credit-options',
  PensionType = 'pension-type',
  BabyCostCalculator = 'baby-cost-calculator',
  WorkplacePensionCalculator = 'workplace-pension-calculator',
  CashInChunksCalculator = 'cash-in-chunks-calculator',
  TakeWholePot = 'take-whole-pot',
  GuaranteedIncomeEstimator = 'guaranteed-income-estimator',
  LeavePotUntouched = 'leave-pot-untouched',
  AjustableIncomeEstimator = 'ajustable-income-estimator',
  MortgageAffordability = 'mortgage-affordability-calculator',
  SavingsCalculator = 'savings-calculator',
  BabyMoneyTimeline = 'baby-money-timeline',
}

export enum UrlPath {
  MidLifeMot = 'mid-life-mot',
  CreditRejection = 'credit-rejection',
  CreditOptions = 'credit-options',
  PensionType = 'pension-type',
  BabyCostCalculator = 'baby-cost-calculator',
  WorkplacePensionCalculator = 'workplace-pension-calculator',
  CashInChunksCalculator = 'cash-in-chunks-calculator',
  TakeWholePot = 'take-whole-pot',
  GuaranteedIncomeEstimator = 'guaranteed-income-estimator',
  LeavePotUntouched = 'leave-pot-untouched',
  AjustableIncomeEstimator = 'ajustable-income-estimator',
  MortgageAffordability = 'mortgage-affordability-calculator',
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
