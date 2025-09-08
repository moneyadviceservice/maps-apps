import { ReactNode } from 'react';

import { AnalyticsData } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';

export interface CalculatorField {
  name: string;
  label: string | ((z: ReturnType<typeof useTranslation>['z']) => string);
  type: 'money' | 'select' | 'number' | 'text';
  required?: boolean;
  options?: Array<{ value: string; text: string }>;
  defaultValue?: string | number;
  placeholder?: string;
  validation?: (value: any) => string | undefined;
}

export interface CalculatorResult {
  [key: string]: any;
}

export interface CalculatorConfig<TInput = any, TResult = CalculatorResult> {
  // Basic configuration
  name: string;
  title: string;
  introduction:
    | ReactNode
    | ((
        isEmbedded: boolean,
        z: ReturnType<typeof useTranslation>['z'],
      ) => ReactNode);

  // Form configuration
  fields:
    | CalculatorField[]
    | ((z: ReturnType<typeof useTranslation>['z']) => CalculatorField[]);
  fieldOptions?: Record<
    string,
    (
      z: ReturnType<typeof useTranslation>['z'],
    ) => Array<{ value: string; text: string }>
  >;

  // Calculation logic
  calculate: (input: TInput) => TResult | null;

  // Result display
  formatResult: (
    result: TResult,
    input: TInput,
    z: ReturnType<typeof useTranslation>['z'],
    buyerType?: 'firstTimeBuyer' | 'nextHome' | 'additionalHome',
  ) => React.ReactNode;

  resultTitle?: (
    input: TInput,
    z: ReturnType<typeof useTranslation>['z'],
  ) => string;

  // Additional content sections
  howIsItCalculated?: (
    input: TInput,
    isEmbedded: boolean,
    z: ReturnType<typeof useTranslation>['z'],
  ) => ReactNode;
  didYouKnow?: (
    isEmbedded: boolean,
    z: ReturnType<typeof useTranslation>['z'],
  ) => ReactNode;
  findOutMore?: (
    input: TInput,
    isEmbedded: boolean,
    z: ReturnType<typeof useTranslation>['z'],
  ) => ReactNode;
  relatedLinks?: (
    isEmbedded: boolean,
    z: ReturnType<typeof useTranslation>['z'],
  ) => ReactNode;
  haveYouTried?: (
    isEmbedded: boolean,
    z: ReturnType<typeof useTranslation>['z'],
  ) => ReactNode;

  // Validation
  validateForm?: (
    input: TInput,
    z: ReturnType<typeof useTranslation>['z'],
  ) => Record<string, string[]>;

  // Analytics configuration
  analyticsToolName: string;
  analyticsSteps?: {
    calculate: string;
    results: string;
  };

  pagePath?: (z: ReturnType<typeof useTranslation>['z']) => string;
}

export interface BaseCalculatorProps<TInput = any, TResult = CalculatorResult> {
  config: CalculatorConfig<TInput, TResult>;
  initialValues?: Partial<TInput>;
  calculated: boolean;
  analyticsData: AnalyticsData;
  isEmbedded: boolean;
  onCalculate?: (values: TInput) => void;
}

export interface CalculatorState<TInput = any> {
  values: TInput;
  errors: Record<string, string[]>;
  calculated: boolean;
}
