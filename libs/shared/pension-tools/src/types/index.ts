import { ChangeEvent, ReactNode } from 'react';

import { Question } from '@maps-react/form/types';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

export type PensionPotCalculatorType = {
  title: string;
  information?: ReactNode;
  calloutMessage?: ReactNode;
  calloutMessageResults?: ReactNode;
  errorTitle: string;
  buttonText: string;
  submittedButtonText: string;
  resultsButtonText: string;
  resultTitle: string;
};

export type FormContentAnlyticsData = {
  pageName: string;
  pageTitle: string;
  toolName: string;
  stepNames: string[] | string;
  categoryLevels?: string[];
};

export type FormErrorAnalyticsDetails = {
  reactCompType: string;
  reactCompName: string;
  errorMessage: string;
};

export type ErrorField = {
  field: string;
  type: string;
};

export type ErrorObject = {
  [key: string]: ErrorField;
};

export type PensionPotCalculatorResults = {
  queryData: DataFromQuery;
  data: PensionPotCalculatorType;
  fields?: Question[];
  onChange?: (e: ChangeEvent<HTMLInputElement>, field: Question) => void;
};

export type PensionPotInputs = {
  income?: string;
  pot?: string;
  chunk?: string;
  updateChunk?: string;
  age?: string;
  month?: string;
};
