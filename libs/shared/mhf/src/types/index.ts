export interface Entry {
  data: EntryData;
  stepIndex: number;
  steps: string[];
  errors: FormError;
}

export type EntryData = {
  flow: string;
  lang: string;
  [key: string]: string;
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
  step?: string;
  optionsContentKey?: string;
  formErrorContentKey?: string;
  formContentKey?: string;
}) => JSX.Element;

export type RouteConfig = {
  [key: string]: {
    Component: StepComponent;
    guards: string[];
  };
};

export type PageProps = {
  step: string;
  backStep: string;
  errors: FormError;
  flow: string;
  entry: Entry;
  referenceNumber?: string;
  url: string | undefined;
};

export interface RouteFlowValue {
  steps: string[];
}

export type RouteFlow = Map<string, RouteFlowValue>;
