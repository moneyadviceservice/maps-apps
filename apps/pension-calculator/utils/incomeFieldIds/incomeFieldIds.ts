export const GROSS_PAY_ID = 'grossPay';
export const GROSS_PAY_FREQUENCY_ID = 'grossPayFrequency';
export const OTHER_INCOME_LIST_ID = 'other-income';
export const ADD_ANOTHER_INCOME_ID = 'add-another-income';
export const OTHER_INCOME_COUNT_NAME = 'otherIncomeCount';

export type OtherIncomeField = 'name' | 'amount' | 'frequency';

export const otherIncomeFieldId = (index: number, field: OtherIncomeField) =>
  `other-income-${index}-${field}`;

export const otherIncomeNameId = (index: number) =>
  otherIncomeFieldId(index, 'name');
export const otherIncomeAmountId = (index: number) =>
  otherIncomeFieldId(index, 'amount');
export const otherIncomeFrequencyId = (index: number) =>
  otherIncomeFieldId(index, 'frequency');
export const otherIncomeRemoveId = (index: number) =>
  `other-income-${index}-remove`;

const OTHER_INCOME_FIELD_PATTERN =
  /^other-income-(\d+)-(name|amount|frequency)$/;

export const parseOtherIncomeFieldId = (key: string) => {
  const match = OTHER_INCOME_FIELD_PATTERN.exec(key);
  if (!match) {
    return null;
  }

  return {
    index: Number(match[1]),
    field: match[2] as OtherIncomeField,
  };
};
