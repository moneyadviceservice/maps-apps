import { FormErrorsState } from 'components/Register/Register';
import { page } from 'data/pages/register';

import { getOtpErrorMessage } from '../getOtpErrorMessage';

/**
 * Transforms the internal FormErrorsState into a UI-friendly
 * Record of error message arrays.
 */
export const generateSummaryErrors = (
  formErrors: FormErrorsState | null | undefined,
  inputs: typeof page.createAccountPage.inputs,
  email: string,
  isRadio = false,
): Record<string, (string | undefined)[]> | null => {
  if (!formErrors) return null;

  const transformedErrors: Record<string, (string | undefined)[]> = {};

  Object.entries(formErrors).forEach(([fieldName, value]) => {
    const { error: errorType } = value;

    if (!errorType) return;

    let message: string | undefined;

    const fieldLabel =
      inputs.find((input) => input.key === fieldName)?.label || fieldName;

    if (fieldName === 'otp') {
      message = getOtpErrorMessage(errorType, email);
    } else if (errorType === 'email_exists') {
      message = `This email address is already registered.`;
    } else if (isRadio) {
      message = `Please select an option`;
    } else {
      const lowerLabel = fieldLabel.toLowerCase();
      const formattedLabel = lowerLabel.replaceAll(/\birn\b/gi, 'IRN');

      message = `Please enter a valid ${formattedLabel}`;
    }

    transformedErrors[fieldName] = [message];
  });

  return transformedErrors;
};
