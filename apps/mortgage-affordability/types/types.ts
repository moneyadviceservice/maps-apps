import { ReactNode } from 'react';

export type FormContentAnlyticsData = {
  pageName: string;
  pageTitle: string;
  toolName: string;
  stepNames: string[] | string;
  categoryLevels?: string[];
};

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
