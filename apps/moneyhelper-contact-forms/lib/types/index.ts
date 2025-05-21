import { GetServerSidePropsContext } from 'next';

export interface Entry {
  data: EntryData;
  stepIndex: number;
  errors: FormError[];
}

export type EntryData = {
  flow: string;
  lang: string;
  [key: string]: string;
};

export type FormError = {
  field: string;
  message: string;
};

export type StepComponent = (props: {
  errors?: FormError[];
  entry?: Entry;
  flow?: string;
}) => JSX.Element;

export type RouteConfig = {
  [key: string]: {
    Component: StepComponent;
    guards: ((context: GetServerSidePropsContext) => Promise<void>)[];
  };
};

export type PageProps = {
  step: string;
  backStep: string;
  errors: FormError[];
  flow: string;
  entry: Entry;
};
