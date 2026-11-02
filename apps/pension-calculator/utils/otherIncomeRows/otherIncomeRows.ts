import {
  emptyOtherIncomeRow,
  MAX_OTHER_INCOME_ROWS,
  type YourIncomeData,
  type YourIncomeErrors,
} from 'types/income';
import {
  otherIncomeFieldId,
  parseOtherIncomeFieldId,
} from 'utils/incomeFieldIds';

export const addOtherIncomeRow = (data: YourIncomeData): YourIncomeData => {
  if (data.otherIncome.length >= MAX_OTHER_INCOME_ROWS) {
    return data;
  }

  return {
    ...data,
    otherIncome: [...data.otherIncome, emptyOtherIncomeRow()],
  };
};

export const removeOtherIncomeRow = (
  data: YourIncomeData,
  index: number,
): YourIncomeData => {
  if (data.otherIncome.length <= 1) {
    return data;
  }

  return {
    ...data,
    otherIncome: data.otherIncome.filter((_, rowIndex) => rowIndex !== index),
  };
};

export const errorsAfterRemovingRow = (
  errors: YourIncomeErrors,
  removedIndex: number,
): YourIncomeErrors => {
  const next: YourIncomeErrors = {};

  Object.entries(errors).forEach(([key, messages]) => {
    const parsed = parseOtherIncomeFieldId(key);
    if (!parsed) {
      next[key] = messages;
      return;
    }

    if (parsed.index === removedIndex) {
      return;
    }

    const newIndex =
      parsed.index > removedIndex ? parsed.index - 1 : parsed.index;
    next[otherIncomeFieldId(newIndex, parsed.field)] = messages;
  });

  return next;
};

export const canRemoveOtherIncome = (rowCount: number) => rowCount > 1;

export const canAddOtherIncome = (rowCount: number) =>
  rowCount < MAX_OTHER_INCOME_ROWS;
