import { SavingsCalculatorType } from 'components/SavingsCalculator/SavingsCalculator';

export type ErrorField = {
  field: string;
  type: string;
};

export type ErrorObject = {
  [key: string]: ErrorField;
};

export type SavingInputs = {
  savingGoal?: string;
  amount?: string;
  amountDuration?: string;
  durationMonth?: string;
  durationYear?: string;
  dateYear?: string;
  saved?: string;
  interest?: string;
};

export type SavingsCalculatorValidation = {
  inputs: SavingInputs;
  type: SavingsCalculatorType;
};

export const formatQuery = (value: string) => {
  return Number(value?.replaceAll(',', ''));
};

export const savingsValidateInputs = (data: SavingsCalculatorValidation) => {
  const {
    savingGoal,
    amount,
    amountDuration,
    dateYear,
    saved,
    interest,
    durationMonth,
    durationYear,
  } = data.inputs;

  const values = {
    savingGoal,
    amount,
    dateYear,
    saved,
    interest,
    amountDuration,
    durationMonth,
    durationYear,
  };

  let errors = getErrorRequiredOrInvalid(values);

  if (durationMonth && durationYear) {
    errors = validateDate(durationMonth, durationYear, errors);
  }

  return errors;
};

const validateDate = (
  durationMonth: string,
  durationYear: string,
  errors: ErrorField[],
) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const inputYear = Number(durationYear);
  const inputMonth = Number(durationMonth);

  if (inputYear === currentYear && inputMonth < currentMonth) {
    errors.push({
      field: 'date',
      type: 'invalid',
    });
  }

  if (inputYear === currentYear && inputMonth === currentMonth) {
    errors.push({
      field: 'date',
      type: 'required',
    });
  }

  return errors;
};

const getErrorRequiredOrInvalid = (values: SavingInputs) => {
  return Object.keys(values)
    .filter((v) => {
      return values[v as keyof SavingInputs] !== undefined;
    })
    .reduce((acc, key) => {
      const value = values[key as keyof SavingInputs];
      if (value?.length === 0) {
        acc.push({
          field: key,
          type: 'required',
        });
      }

      const hasValue = value && value?.length > 0;
      const isInvalid = hasValue && isNaN(Number(value.replaceAll(',', '')));
      const hasDecimials = hasValue && value.includes('.');

      if (isInvalid || (hasDecimials && key !== 'interest')) {
        acc.push({
          field: key,
          type: 'invalid',
        });
      }

      if (!isInvalid && hasValue && Number(value.replaceAll(',', '')) < 1) {
        acc.push({
          field: key,
          type: 'min',
        });
      }

      if (
        !isInvalid &&
        hasValue &&
        Number(value.replaceAll(',', '')) > 999999999 &&
        key !== 'interest'
      ) {
        acc.push({
          field: key,
          type: 'max',
        });
      }

      if (!isInvalid && hasValue && key === 'interest') {
        const interestErrors = validateInterest(value);
        acc.push(...interestErrors);
      }

      return acc;
    }, [] as ErrorField[]);
};

const validateInterest = (value: string): ErrorField[] => {
  const errors: ErrorField[] = [];

  if (value.replaceAll(',', '').length > 6) {
    errors.push({
      field: 'interest',
      type: 'max',
    });
  }

  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    errors.push({
      field: 'interest',
      type: 'invalid',
    });
  }

  return errors;
};

export const getSixMonthsFromCurrentDate = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  let sixMonthsFromCurrentMonth = currentMonth + 6;
  let sixMonthsFromCurrentYear = currentYear;

  if (sixMonthsFromCurrentMonth > 11) {
    sixMonthsFromCurrentMonth -= 12;
    sixMonthsFromCurrentYear += 1;
  }

  const sixMonthsFromCurrentDate = new Date(
    sixMonthsFromCurrentYear,
    sixMonthsFromCurrentMonth,
    currentDay,
  );

  return {
    day: sixMonthsFromCurrentDate.getDate(),
    month: sixMonthsFromCurrentDate.getMonth(),
    year: sixMonthsFromCurrentDate.getFullYear(),
  };
};
