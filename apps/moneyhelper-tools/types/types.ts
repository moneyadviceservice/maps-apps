import { ReactNode } from 'react';

export type Question = {
  questionNbr: number;
  group: string;
  definition?: string | ReactNode;
  title: string;
  type: string;
  subType?: string;
  target?: string;
  description?: string;
  answers: Answer[];
  inputProps?: {
    maxLimit?: number;
    labelValue?: string;
  };
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
  stepNames: string[];
};

export enum DataPath {
  MidLifeMot = 'midlife-mot',
  CreditRejection = 'credit-rejection',
  CreditOptions = 'credit-options',
  PensionType = 'pension-type',
  WorkplacePensionCalculator = 'workplace-pension-calculator',
}

export enum UrlPath {
  MidLifeMot = 'mid-life-mot',
  CreditRejection = 'credit-rejection',
  CreditOptions = 'credit-options',
  PensionType = 'pension-type',
  WorkplacePensionCalculator = 'workplace-pension-calculator',
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
