import { ReactNode } from 'react';

export type Question = {
  questionNbr: number;
  group: string;
  definition?: string | ReactNode;
  title: string;
  type: string;
  subType?: string;
  target?: string;
  useLegend?: boolean;
  description?: string | ReactNode;
  exampleText?: string | ReactNode;
  answers: Answer[];
  classes?: string[];
  inputProps?: {
    maxLimit?: number;
    labelValue?: string;
    additionalLabels?: {
      label1?: string;
      label2?: string;
      label3?: string;
    };
  };
  calloutData?: ReactNode;
  errors?: Record<string, string | ReactNode>;
};

export type TranslationGroupString = {
  readonly en: string;
  readonly cy: string;
};

export type Answer = {
  text: string;
  value?: string;
  subtext?: ReactNode;
  score?: number;
  unselectedScore?: number;
  clearAll?: boolean;
  showLinksIfSelected?: boolean;
  links?: Links[];
  unselectedAnswerLinks?: Links[];
  availability?: string;
  disabled?: boolean;
};

export type Links = {
  title: string;
  link: string;
  type: string;
  description?: string;
};

export type ErrorType = {
  question: number | string;
  message: string;
  type?: string;
};

export type ErrorField = {
  field: string;
  type: string;
};

export type ErrorObject = {
  [key: string]: ErrorField;
};
