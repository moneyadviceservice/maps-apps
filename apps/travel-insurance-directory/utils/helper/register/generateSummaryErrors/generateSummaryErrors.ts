import { page } from 'data/pages/register';
import {
  FormErrorsState,
  HideErrorWhen,
  InputErrorTypes,
} from 'types/register';

import { getOtpErrorMessage } from '../getOtpErrorMessage';

function formatFieldKeyFallback(fieldName: string): string {
  return fieldName
    .replace(/[_-]/g, ' ')
    .toLowerCase()
    .replaceAll(/\birn\b/g, 'IRN');
}

function resolveFieldLabel(
  fieldName: string,
  inputs: typeof page.createAccountPage.inputs,
  fieldLabels?: Record<string, string>,
): string {
  return (
    fieldLabels?.[fieldName] ??
    inputs.find((input) => input.key === fieldName)?.label ??
    formatFieldKeyFallback(fieldName)
  );
}

function errorShouldBeHidden(
  hideErrorWhen?: HideErrorWhen,
  allFormErrors?: FormErrorsState,
): boolean {
  return !!(
    hideErrorWhen?.relatedFieldIsInvalid &&
    allFormErrors?.[hideErrorWhen.relatedFieldKey]?.error
  );
}

/**
 * Transforms the internal FormErrorsState into a UI-friendly
 * Record of error message arrays.
 */
export const generateSummaryErrors = (
  formErrors: FormErrorsState | null | undefined,
  inputs: typeof page.createAccountPage.inputs,
  email: string,
  isRadio = false,
  errorMessageOverrides?: Record<string, string | Record<string, string>>,
  fieldLabels?: Record<string, string>,
  fieldRequiredMessages?: Record<string, string>,
): Record<string, (string | undefined)[]> | null => {
  if (!formErrors) return null;

  const fieldOrder = fieldLabels
    ? Object.keys(fieldLabels)
    : inputs.map((input) => input.key);

  const buildMessage = (
    fieldName: string,
    errorType: InputErrorTypes,
    hideError = false,
  ): string => {
    const fieldLabel =
      inputs.find((input) => input.key === fieldName)?.label || fieldName;

    if (hideError) {
      return '';
    }

    if (fieldName === 'otp') {
      return getOtpErrorMessage(errorType, email);
    }

    if (errorType === 'email_exists') {
      return 'This email address is already registered.';
    }

    const errorOverride = errorMessageOverrides?.[errorType];
    if (errorOverride && typeof errorOverride !== 'string') {
      const fieldOverride = errorOverride[fieldName];
      if (fieldOverride) {
        return fieldOverride;
      }
    } else if (errorMessageOverrides?.[fieldName]) {
      const override = errorMessageOverrides[fieldName];
      return typeof override === 'string' ? override : override[errorType];
    }

    if (isRadio) {
      const selectLabel = resolveFieldLabel(fieldName, inputs, fieldLabels);
      const requiredMessage =
        fieldRequiredMessages?.[fieldName] ?? 'Please select an option';

      return `${selectLabel} - ${requiredMessage}`;
    }

    const formattedLabel = fieldLabel
      .replace(/[_-]/g, ' ')
      .toLowerCase()
      .replaceAll(/\birn\b/g, 'IRN');

    return `Please enter a valid ${formattedLabel}`;
  };

  const transformedErrors: Record<string, (string | undefined)[]> = {};

  const addError = (fieldName: string, hideErrorMessage = false) => {
    const errorType = formErrors[fieldName]?.error;
    if (!errorType) return;
    transformedErrors[fieldName] = [
      buildMessage(fieldName, errorType, hideErrorMessage),
    ];
  };

  fieldOrder.forEach((fieldName) => addError(fieldName));

  Object.keys(formErrors).forEach((fieldName) => {
    if (!(fieldName in transformedErrors)) {
      const hideErrorWhen = formErrors[fieldName]?.hideErrorWhen;
      const hideErrorMessage =
        hideErrorWhen && errorShouldBeHidden(hideErrorWhen, formErrors);

      addError(fieldName, hideErrorMessage);
    }
  });

  return transformedErrors;
};
