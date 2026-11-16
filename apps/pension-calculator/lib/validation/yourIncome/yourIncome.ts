import { getIncomeErrorMessage, type IncomeErrorKey } from 'data/your-income';
import type { YourIncomeData, YourIncomeErrors } from 'types/income';
import {
  GROSS_PAY_ID,
  otherIncomeAmountId,
  otherIncomeNameId,
} from 'utils/incomeFieldIds';

export const isNumericAmount = (value: string): boolean => {
  const normalised = value.replaceAll(',', '').trim();
  if (!normalised) {
    return false;
  }

  return /^\d+(\.\d{1,2})?$/.test(normalised);
};

const isBlank = (value: string) => value.trim() === '';

const addError = (
  errors: YourIncomeErrors,
  fieldId: string,
  key: IncomeErrorKey,
  lang: string,
) => {
  const message = getIncomeErrorMessage(key, lang);
  errors[fieldId] ??= [];
  errors[fieldId].push(message);
};

export const validateYourIncome = (
  data: YourIncomeData,
  lang = 'en',
): YourIncomeErrors => {
  const errors: YourIncomeErrors = {};

  if (isBlank(data.grossPay)) {
    addError(errors, GROSS_PAY_ID, 'grossPayRequired', lang);
  } else if (!isNumericAmount(data.grossPay)) {
    addError(errors, GROSS_PAY_ID, 'amountInvalid', lang);
  }

  data.otherIncome.forEach((row, index) => {
    const nameBlank = isBlank(row.name);
    const amountBlank = isBlank(row.amount);

    if (nameBlank && amountBlank) {
      return;
    }

    if (nameBlank) {
      addError(
        errors,
        otherIncomeNameId(index),
        'otherIncomeNameRequired',
        lang,
      );
    }

    if (amountBlank) {
      addError(
        errors,
        otherIncomeAmountId(index),
        'otherIncomeAmountRequired',
        lang,
      );
    } else if (!isNumericAmount(row.amount)) {
      addError(errors, otherIncomeAmountId(index), 'amountInvalid', lang);
    }
  });

  return errors;
};

export const hasYourIncomeErrors = (errors: YourIncomeErrors) =>
  Object.keys(errors).length > 0;
