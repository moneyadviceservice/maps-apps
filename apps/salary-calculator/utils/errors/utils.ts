import { SalaryFormData } from 'components/SalaryForm';
import { calculateFrequencyAmount } from 'utils/calculations/calculateFrequencyAmount';
import { convertToAnnualSalary } from 'utils/helpers/convertToAnnualSalary';
import { PayFrequency } from 'utils/helpers/convertToAnnualSalary/convertToAnnualSalary';
import { FieldError } from 'utils/validation';

import useTranslation from '@maps-react/hooks/useTranslation';

import { idMap } from './idmap';
import { errorMessages, salary2ForText, salary2Text } from './messages';

type TranslationFunction = ReturnType<typeof useTranslation>['z'];

const isValidError = (error: FieldError): boolean => {
  return (
    Boolean(error) &&
    typeof error.field === 'string' &&
    typeof error.type === 'string'
  );
};

export const getMonthlyGrossIncome = (salary: {
  grossIncome: string | number;
  grossIncomeFrequency: PayFrequency;
  hoursPerWeek?: string | number;
  daysPerWeek?: string | number;
}): number | null => {
  if (!salary.grossIncome || !salary.grossIncomeFrequency) return null;

  const grossIncomeNumber = Number(salary.grossIncome);
  const daysPerWeekNumber = salary.daysPerWeek
    ? Number(salary.daysPerWeek)
    : undefined;
  const hoursPerWeekNumber = salary.hoursPerWeek
    ? Number(salary.hoursPerWeek)
    : undefined;

  const annualGross = convertToAnnualSalary({
    grossIncome: grossIncomeNumber,
    frequency: salary.grossIncomeFrequency,
    daysPerWeek: daysPerWeekNumber,
    hoursPerWeek: hoursPerWeekNumber,
  });

  return calculateFrequencyAmount({ yearlyAmount: annualGross }).monthly;
};

const appendMonthlyIncomeToMessage = (
  message: string,
  salary: SalaryFormData | undefined,
  z: TranslationFunction, // add the translation function here
): string => {
  if (!salary) {
    return message;
  }

  const monthly = getMonthlyGrossIncome(salary);
  if (monthly === null) {
    return message;
  }

  const monthlyText = z({
    en: '(your monthly gross income)',
    cy: '(eich incwm gros misol)',
  });

  return `${message} £${monthly.toFixed(2)} ${monthlyText}`;
};
const processError = (
  error: FieldError,
  z: TranslationFunction,
  salary1?: SalaryFormData,
  salary2?: SalaryFormData,
): { fieldId: string; message: string } | null => {
  if (!isValidError(error)) {
    return null;
  }

  // Only process if the field and error type are mapped
  if (!(error.field in idMap) || !(error.type in errorMessages)) {
    return null;
  }

  const initialMessage = getErrorMessage(
    error.type,
    z,
    error.field.startsWith('salary2_'),
  );

  // If pension-fixed-invalid, append monthly income
  const message =
    error.type === 'pension-fixed-invalid'
      ? appendMonthlyIncomeToMessage(
          initialMessage,
          error.field.startsWith('salary2_') ? salary2 : salary1,
          z,
        )
      : initialMessage;

  return {
    fieldId: idMap[error.field],
    message,
  };
};

export const parseErrors = (
  errors: string | null | undefined,
  z: TranslationFunction,
  salary1?: SalaryFormData,
  salary2?: SalaryFormData,
): Record<string, (string | undefined)[]> | undefined => {
  if (!errors) {
    return undefined;
  }

  try {
    const parsedFieldErrors = JSON.parse(errors) as FieldError[];

    if (!Array.isArray(parsedFieldErrors)) {
      return {};
    }

    const result: Record<string, (string | undefined)[]> = {};

    for (const error of parsedFieldErrors) {
      const processed = processError(error, z, salary1, salary2);
      if (processed) {
        result[processed.fieldId] = [processed.message];
      }
    }

    return result;
  } catch (e) {
    console.warn('Invalid error string', e);
    return undefined;
  }
};

export const getErrorMessage = (
  key: keyof typeof errorMessages,
  z: TranslationFunction,
  isSalary2 = false,
): string => {
  const template = z(errorMessages[key]);

  const salary2 = isSalary2 ? z(salary2Text) : '';
  const salary2Suffix = isSalary2 ? ' 2' : '';
  const salary2For = isSalary2 ? z(salary2ForText) : '';

  return template
    .replace('{salary2}', salary2)
    .replace('{salary2Suffix}', salary2Suffix)
    .replace('{salary2For}', salary2For);
};
