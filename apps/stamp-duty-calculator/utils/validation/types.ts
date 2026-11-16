/**
 * Field-level validation errors for date inputs
 */
export interface DateFieldErrors {
  day?: boolean;
  month?: boolean;
  year?: boolean;
}

/**
 * Generic field validation errors
 */
export interface FieldErrors {
  [fieldName: string]: DateFieldErrors | boolean;
}

/**
 * Validation result with optional field-specific errors
 */
export interface ValidationResult {
  errors: Record<string, string[]>;
  fieldErrors?: {
    purchaseDate?: DateFieldErrors;
    [key: string]: DateFieldErrors | undefined;
  };
}

/**
 * Error message configuration for purchase date validation
 */
export interface PurchaseDateErrorMessages {
  required: string;
  invalid: string;
  tooEarly: string;
  missingDay: string;
  missingMonth: string;
  missingYear: string;
  missingDayMonth: string;
  missingDayYear: string;
  missingMonthYear: string;
}

/**
 * Translation function type
 */
export type TranslationFunction = (
  options: { en: string; cy: string },
  params?: Record<string, unknown>,
) => string;

/**
 * Common input interface for stamp duty calculators
 */
export interface StampDutyCommonInput {
  buyerType: string;
  price: string;
  purchaseDate: string;
}

/**
 * Date components for validation
 */
export interface DateComponents {
  day: string;
  month: string;
  year: string;
}

/**
 * Date validation constraints
 */
export interface DateConstraints {
  minDate?: Date;
  maxDate?: Date;
  minYear?: number;
  maxYear?: number;
}
