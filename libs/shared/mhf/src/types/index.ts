import type { JSX } from 'react';

import type { Language } from '@maps-react/utils/language';

import { SubmissionState } from '../constants';

export interface Entry {
  data: EntryData;
  stepIndex: number;
  steps: string[];
  errors: FormError;
  meta?: SubmissionMeta;
}

export type EntryData = {
  flow: string;
  locale: Language;
  [key: string]: string | string[];
};

export type FormError = Record<string, (string | undefined)[]>; // Object with field names as keys and array of error messages as values

export type StepComponent = (props: {
  errors?: FormError;
  entry?: Entry;
  flow?: string;
  step: string;
  referenceNumber?: string;
}) => JSX.Element;

export type OptionTypesProps = (props: {
  errors?: FormError;
  step: string;
  name: string;
  optionsContentKey?: string;
  formErrorContentKey?: string;
  formContentKey?: string;
  defaultChecked?: string;
  nextStep?: string;
}) => JSX.Element;

export type RouteConfig = {
  [key: string]: {
    Component: StepComponent;
    guards: string[];
  };
};

export type PageProps = {
  step: string;
  backStep?: string;
  errors: FormError;
  flow: string;
  entry: Entry;
  referenceNumber?: string;
  url: string | undefined;
};

export interface FlowConfigValue {
  autoAdvanceStep?: string;
  [key: string]: unknown;
}

export type FlowConfig = Map<string, FlowConfigValue>;

export type ResponseData = {
  [key: string]: unknown;
};

export type SubmissionMeta = {
  submissionState: SubmissionState;
  submissionKey?: string;
  responseData?: ResponseData;
  submissionStartedAt?: string;
  submissionErrorStatus?: string;
};
