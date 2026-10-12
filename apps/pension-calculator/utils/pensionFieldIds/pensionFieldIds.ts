export const POT_SCREENING_ID = 'has-pot-of-money-pension-0';
export const POT_SCREENING_NAME = 'hasPotOfMoneyPension';
export const POT_COUNT_NAME = 'potCount';
export const POT_LIST_ID = 'pension-pots';
export const ADD_PENSION_ID = 'add-another-pension';
export const potFieldId = (
  index: number,
  field: 'name' | 'currentValue' | 'taxFreeCash',
) => `pension-pot-${index}-${field}`;
export const potNameId = (index: number) => potFieldId(index, 'name');
export const potCurrentValueId = (index: number) =>
  potFieldId(index, 'currentValue');
export const potTaxFreeCashId = (index: number) =>
  potFieldId(index, 'taxFreeCash');
export const potRemoveId = (index: number) => `pension-pot-${index}-remove`;
export const contributionFieldId = (
  kind: 'employee' | 'employer',
  field: 'mode' | 'value' | 'frequency',
) => `${kind}-contribution-${field}`;
