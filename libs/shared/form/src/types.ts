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
