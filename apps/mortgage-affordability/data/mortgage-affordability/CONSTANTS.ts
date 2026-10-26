import { ExpenseFieldKeys } from './step';

export const MAC_DEFAULT_REPAYMENT_TERM = 25;
export const MAC_REPAYMENT_TERM_MIN = 1;
export const MAC_REPAYMENT_TERM_MAX = 40;
export const MAC_DEFAULT_INTEREST = 4;
export const MAC_MIN_INTEREST = 1;
export const MAC_MAX_INTEREST = 15;
export const MAC_MAX_INPUT_VALUE = 999999999;
export const UPPER_PROFIT_MULTIPLIER = 5;
export const LOWER_PROFIT_MULTIPLIER = 1.5;

// Outgoings included in the affordability rating. Current rent/mortgage is
// excluded because the new mortgage repayment replaces it.
export const AFFORDABILITY_EXPENSE_FIELDS: ExpenseFieldKeys[] = [
  ExpenseFieldKeys.CARD_AND_LOAN,
  ExpenseFieldKeys.CARE_SCHOOL,
  ExpenseFieldKeys.CHILD_SPOUSAL,
  ExpenseFieldKeys.TRAVEL,
  ExpenseFieldKeys.BILLS_INSURANCE,
  ExpenseFieldKeys.LEISURE,
  ExpenseFieldKeys.HOLIDAYS,
  ExpenseFieldKeys.GROCERIES,
];
