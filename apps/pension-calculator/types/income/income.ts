import { DEFAULT_FREQUENCY, type FrequencyValue } from 'data/frequency';

export const MAX_OTHER_INCOME_ROWS = 5;

export type OtherIncomeRow = {
  name: string;
  amount: string;
  frequency: FrequencyValue;
};

export type YourIncomeData = {
  grossPay: string;
  grossPayFrequency: FrequencyValue;
  otherIncome: OtherIncomeRow[];
};

export type YourIncomeErrors = Record<string, string[]>;

export const emptyOtherIncomeRow = (): OtherIncomeRow => ({
  name: '',
  amount: '',
  frequency: DEFAULT_FREQUENCY,
});

export const defaultYourIncomeData = (): YourIncomeData => ({
  grossPay: '',
  grossPayFrequency: DEFAULT_FREQUENCY,
  otherIncome: [emptyOtherIncomeRow()],
});
