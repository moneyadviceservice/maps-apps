import { ReactNode } from 'react';

import { AnalyticsData } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';

import type { BuyerType as WalesBuyerType } from '../../data/rates/LTTRates';
import type { BuyerType as StandardBuyerType } from '../../data/rates/SDLTRates';
import { DateFieldErrors as FieldValidation } from '../../utils/validation/types';

/**
 * StandardBuyerType: 'firstTimeBuyer' | 'nextHome' | 'additionalHome' (SDLT, LBTT)
 * WalesBuyerType: 'firstOrNextHome' | 'additionalHome' (LTT)
 */
export type BuyerType = StandardBuyerType | WalesBuyerType;

/**
 * Base input structure for all property tax calculators
 * All calculators have buyerType, price, and purchaseDate
 * Note: buyerType is typed as BuyerType union to support all calculators
 */
export interface PropertyTaxCalculatorInput {
  buyerType: BuyerType;
  price: string;
  purchaseDate: string;
}

/**
 * Base result structure for all property tax calculators
 * All calculators return tax amount, percentage, and the purchase date used in the calculation
 */
export interface PropertyTaxCalculatorResult {
  tax: number;
  percentage: number;
  purchaseDate: string;
}

export interface CalculatorField {
  name: string;
  label: string | ((z: ReturnType<typeof useTranslation>['z']) => string);
  type: 'money' | 'select' | 'number' | 'text' | 'date';
  required?: boolean;
  options?: Array<{ value: string; text: string }>;
  defaultValue?: string | number;
  placeholder?: string;
  hint?: string | ((z: ReturnType<typeof useTranslation>['z']) => string);
  validation?: (value: any) => string | undefined;
}

/**
 * Validation result with optional field-specific errors
 */
export interface ValidationResult {
  errors: Record<string, string[]>;
  fieldErrors?: {
    purchaseDate?: FieldValidation;
    [key: string]: FieldValidation | undefined;
  };
}

export interface CalculatorConfig<
  CalculatorInput = PropertyTaxCalculatorInput,
  CalculatorResult = PropertyTaxCalculatorResult,
> {
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
  calculate: (input: CalculatorInput) => CalculatorResult | null;

  // Result display
  formatResult: (
    result: CalculatorResult,
    input: CalculatorInput,
    z: ReturnType<typeof useTranslation>['z'],
    buyerType?: 'firstTimeBuyer' | 'nextHome' | 'additionalHome',
  ) => React.ReactNode;

  resultTitle?: (
    input: CalculatorInput,
    z: ReturnType<typeof useTranslation>['z'],
  ) => string;

  // Additional content sections
  howIsItCalculated?: (
    input: CalculatorInput,
    isEmbedded: boolean,
    z: ReturnType<typeof useTranslation>['z'],
  ) => ReactNode;
  didYouKnow?: (
    isEmbedded: boolean,
    z: ReturnType<typeof useTranslation>['z'],
  ) => ReactNode;
  findOutMore?: (
    input: CalculatorInput,
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
    input: CalculatorInput,
    z: ReturnType<typeof useTranslation>['z'],
  ) => ValidationResult;

  // Analytics configuration
  analyticsToolName: string;
  analyticsSteps?: {
    calculate: string;
    results: string;
  };

  socialShareTitle: {
    en: string;
    cy: string;
  };

  pagePath?: (z: ReturnType<typeof useTranslation>['z']) => string;
}

export interface BaseCalculatorProps<
  CalculatorInput = PropertyTaxCalculatorInput,
  CalculatorResult = PropertyTaxCalculatorResult,
> {
  config: CalculatorConfig<CalculatorInput, CalculatorResult>;
  initialValues?: Partial<CalculatorInput>;
  calculated: boolean;
  analyticsData: AnalyticsData;
  isEmbedded: boolean;
  onCalculate?: (values: CalculatorInput) => void;
}

export interface CalculatorState<CalculatorInput = PropertyTaxCalculatorInput> {
  values: CalculatorInput;
  errors: Record<string, string[]>;
  calculated: boolean;
}
