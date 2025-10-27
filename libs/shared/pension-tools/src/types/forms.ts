import { ReactNode } from 'react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

export type FieldType =
  | 'select'
  | 'input-currency'
  | 'input-currency-with-select'
  | 'radio';

export interface FormFieldValidation {
  required?: boolean;
  requiredPageMessage?: string;
  requiredInputMessage?: string;
  acdlMessage?: string;
  type?: FieldType;
  rules?: ValidationRules[];
  bounds?: { lower: string; upper: string };
  userNotSeen?: boolean;
}

export interface ValidationRules {
  condition: '>' | '<' | '>=' | '<=';
  otherField?: string;
  multiplier?: number;
  otherFieldMultiplier?: number;
  condition2?: '+';
  otherField2?: string;
  value?: string | number | boolean;
  rulePageMessage?: string;
  ruleInputMessage?: string;
  acdlMessage?: string;
}

export interface FormValidationObj {
  [key: string]: FormFieldValidation | undefined;
}

type FormFieldGroup = {
  label: string;
  text?: string;
  key: string;
  type?: GroupType;
};

export type FieldCondition = {
  field: string;
  value: string | number | boolean;
  rule: '=' | '>' | '<' | '>=' | '<=';
};

type FormFieldBase = {
  key: string;
  connectField?: string; // to be used like a foreign key
  fieldCondition?: FieldCondition; // Used on radio buttons with array of field keys to duplicate
  label: string;
  acdlLabel?: string;
  description?: string;
  type: FieldType;
  options?: {
    text: string;
    value: string;
  }[];
  expandableContent?: {
    title: string;
    text: string | ReactNode;
  };
  validation?: FormFieldValidation;
  group?: FormFieldGroup;
  addon?: string;
  topMargin?: boolean;
};

type FormFieldWithDefaultValues =
  | {
      type: 'select';
      placeholder?: string;
      placeholderInput?: never;
      placeholderSelect?: never;
      defaultInputValue?: never;
      defaultSelectValue: string | number;
      defaultRadioValue?: never;
    }
  | {
      type: 'input-currency';
      placeholder?: string;
      placeholderInput?: never;
      placeholderSelect?: never;
      defaultInputValue?: string | number;
      defaultSelectValue?: never;
      defaultRadioValue?: never;
    }
  | {
      type: 'input-currency-with-select';
      placeholder?: never;
      placeholderInput?: string;
      placeholderSelect?: string;
      defaultInputValue?: string | number;
      defaultSelectValue: string | number;
      defaultRadioValue?: never;
    }
  | {
      type: 'radio';
      placeholder?: string;
      placeholderInput?: never;
      placeholderSelect?: never;
      defaultInputValue?: never;
      defaultSelectValue?: never;
      defaultRadioValue?: string | number;
    };

export type FormField = FormFieldBase & FormFieldWithDefaultValues;

export type TabResultContent = {
  success: {
    title: string;
    content: string;
  };
  error: {
    title: string;
    content: string;
  };
  subHeading: string;
};

export type SummaryCalc = 'sub' | 'add' | 'result' | 'exclude';

export type Summary = {
  label: string;
  unit: 'pounds' | 'months';
  calc?: SummaryCalc;
};

type FormContent = {
  content: string | ReactNode;
  fields?: FormField[];
  result?: never;
};

type ResultContent = {
  content?: never;
  fields?: never;
  result: TabResultContent;
};

export type StepData = {
  key: string;
  heading: string;
  buttonText: string;
} & (FormContent | ResultContent);

export type TabData = {
  key?: string;
  linkText?: string;
  summary?: Summary;
  heading: string;
} & (FormContent | ResultContent);

export type TabPageData = {
  toolHeading: string;
  summaryHeading: string;
  tabs: TabData[];
};

export type StepPageData = {
  toolHeading: string;
  steps: StepData[];
};

export type FormData = {
  [key: string]: string | string[] | undefined;
};

export type DefaultValues = {
  [key: string]: string | number;
};

export type ConditionalFields = Set<string>;

export type GroupedFieldItem = {
  name: string;
  value: number;
  url: string;
};

export enum GroupType {
  HEADING = 'heading',
  EXPANDABLE = 'expandable',
}

type ErrorMessageObj = {
  required?: {
    field?: string;
    page?: string;
    acdlMessage?: string;
  };
  condition?: {
    field?: string;
    page?: string;
    acdlMessage?: string;
  };
};

export type ErrorMessageFunc = (
  z: ReturnType<typeof useTranslation>['z'],
) => ErrorMessageObj;

export type Errors = Record<string, string[]> | null;
