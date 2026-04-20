import { RadioInput } from 'components/RadioQuestion/RadioQuestion';

import { CalloutVariant } from '@maps-react/common/components/Callout';
import { Level } from '@maps-react/common/components/Heading';

interface Placeholder {
  ref: string;
  propName: string;
  replacementClassName?: string;
}

export interface Paragraph {
  component: 'paragraph';
  style?: string;
  content: string;
  placeholder?: Placeholder;
}

export interface List {
  component: 'list';
  style?: string;
  items: { label: string; hintText?: string }[];
}

interface Heading {
  component: 'heading';
  level?: Level;
  style?: string;
  componentLevel?: React.ElementType;
  content: string;
}

interface Span {
  component: 'span';
  content: string;
  style?: string;
}

type CalloutChildren = Paragraph | List;

export interface Callout {
  component: 'callout';
  variant?: CalloutVariant;
  style?: string;
  heading: Heading;
  copy: CalloutChildren[];
}

export type CopyItem = Paragraph | List | Callout | Heading | Span;

export interface PageContent {
  heading: string;
  backLink?: string;
  nextPage?: string;
  copy: CopyItem[];
  radioInput: RadioInput;
  hideOnDetailsPage?: boolean;
}

type StepKey = `step${number}`;

export type PageData = Record<StepKey, PageContent>;
