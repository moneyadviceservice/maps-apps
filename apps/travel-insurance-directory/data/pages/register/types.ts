import { RadioInput } from 'components/form/RadioQuestion';

import { Level } from '@maps-react/common/components/Heading';
import { NotificationBoxVariant } from '@maps-react/common/components/NotificationBox';

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

type NotificationBoxChildren = Paragraph | List;

export interface NotificationBox {
  component: 'notification-box';
  variant?: NotificationBoxVariant;
  style?: string;
  heading: Heading;
  copy: NotificationBoxChildren[];
}

export type CopyItem = Paragraph | List | NotificationBox | Heading | Span;

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
