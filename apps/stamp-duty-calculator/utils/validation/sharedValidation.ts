import {
  getBuyerTypeErrorMessage,
  getPriceErrorMessage,
  getPurchaseDateErrorMessages,
} from '../../data/errorMessages';
import {
  validatePurchaseDateDynamic,
  validatePurchaseDateWithFieldErrors,
} from './dateValidation';
import {
  DateFieldErrors,
  StampDutyCommonInput,
  TranslationFunction,
  ValidationResult,
} from './types';

/**
 * Shared purchase date validation for all stamp duty calculators (SDLT, LTT, LBTT)
 * Returns error message or undefined if valid
 */
export const validateSharedPurchaseDate = (
  purchaseDate: string,
  z: TranslationFunction,
): string | undefined => {
  return validatePurchaseDateDynamic(
    purchaseDate,
    getPurchaseDateErrorMessages(z),
  );
};

/**
 * Shared form validation for all stamp duty calculators (SDLT, LTT, LBTT)
 * Validates buyerType, price, and purchaseDate fields
 * Returns both error messages and field-specific errors for date fields
 */
export const validateStampDutyFormWithFieldErrors = <
  T extends StampDutyCommonInput,
>(
  input: T,
  z: TranslationFunction,
): ValidationResult => {
  const errors: Record<string, string[]> = {};
  const fieldErrors: { purchaseDate?: DateFieldErrors } = {};

  // Validate buyer type
  if (!input.buyerType) {
    errors.buyerType = [getBuyerTypeErrorMessage(z)];
  }

  // Validate price
  if (!Number(input.price)) {
    errors.price = [getPriceErrorMessage(z)];
  }

  // Validate purchase date with field-specific errors
  const purchaseDateValidation = validatePurchaseDateWithFieldErrors(
    input.purchaseDate,
    getPurchaseDateErrorMessages(z),
  );

  if (purchaseDateValidation.error) {
    errors.purchaseDate = [purchaseDateValidation.error];
    if (purchaseDateValidation.fieldErrors) {
      fieldErrors.purchaseDate = purchaseDateValidation.fieldErrors;
    }
  }

  return { errors, fieldErrors };
};
