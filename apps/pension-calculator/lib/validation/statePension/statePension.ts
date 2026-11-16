import {
  getStatePensionErrorMessage,
  STATE_PENSION_WEEKLY_AMOUNT_ID,
  STATE_PENSION_WEEKLY_AMOUNT_LIMIT,
} from 'data/state-pension';
import { isNumericAmount } from 'lib/validation/yourIncome/yourIncome';
import type { StatePensionData, StatePensionErrors } from 'types/statePension';

const numericAmount = (value: string) => Number(value.replaceAll(',', ''));

const isAboveWeeklyAmountLimit = (value: string) =>
  isNumericAmount(value) &&
  numericAmount(value) > STATE_PENSION_WEEKLY_AMOUNT_LIMIT;

const fieldError = (
  key: 'amountInvalid' | 'amountTooLarge',
  lang: string,
  maxWeeklyAmount: string,
): StatePensionErrors => ({
  [STATE_PENSION_WEEKLY_AMOUNT_ID]: [
    getStatePensionErrorMessage(key, lang, maxWeeklyAmount),
  ],
});

export const validateStatePension = (
  data: StatePensionData,
  maxWeeklyAmount: string,
  lang = 'en',
): StatePensionErrors => {
  if (data.weeklyAmount.trim() === '') {
    return {};
  }

  if (!isNumericAmount(data.weeklyAmount)) {
    return fieldError('amountInvalid', lang, maxWeeklyAmount);
  }

  if (isAboveWeeklyAmountLimit(data.weeklyAmount)) {
    return fieldError('amountTooLarge', lang, maxWeeklyAmount);
  }

  return {};
};

export const hasStatePensionErrors = (errors: StatePensionErrors) =>
  Object.keys(errors).length > 0;
