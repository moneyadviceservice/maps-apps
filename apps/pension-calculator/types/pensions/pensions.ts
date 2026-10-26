import { DEFAULT_FREQUENCY, type FrequencyValue } from 'data/frequency';
import { JourneyAction } from 'data/journey';

export type YesNo = '' | 'yes' | 'no';
export type ContributionMode = 'percentage' | 'fixed';

export type DefinedContributionPot = {
  name: string;
  currentValue: string;
  taxFreeCash: string;
  employeeContribution: Contribution;
  employerContribution: Contribution;
  annualManagementCharge: string;
};

export type Contribution = {
  mode: ContributionMode;
  value: string;
  frequency: FrequencyValue;
};

export type PotsOfMoneyData = {
  hasPotOfMoneyPension: YesNo;
  pots: DefinedContributionPot[];
};

export type PotsOfMoneyErrors = Record<string, string[]>;

export type DefinedIncome = {
  name: string;
  estimatedYearlyValue: string;
  ageItStartsPaying: string;
  taxFreeCash: string;
};

export type DefinedIncomeData = {
  hasIncomePension: YesNo;
  pots: DefinedIncome[];
  annualManagementCharge: string;
};

export type DefinedIncomeErrors = Record<string, string[]>;

export const emptyPot = (): DefinedContributionPot => ({
  name: '',
  currentValue: '',
  taxFreeCash: '',
  employeeContribution: emptyContribution(),
  employerContribution: emptyContribution(),
  annualManagementCharge: '',
});

export const emptyIncomePot = (): DefinedIncome => ({
  name: '',
  estimatedYearlyValue: '',
  ageItStartsPaying: '',
  taxFreeCash: '',
});

const emptyContribution = (): Contribution => ({
  mode: 'percentage',
  value: '',
  frequency: DEFAULT_FREQUENCY,
});

export const defaultPotsOfMoneyData = (): PotsOfMoneyData => ({
  hasPotOfMoneyPension: '',
  pots: [emptyPot()],
});

export const defaultDefinedIncomeData = (): DefinedIncomeData => ({
  hasIncomePension: '',
  pots: [],
  annualManagementCharge: '',
});

export type PensionsFlow = 'pots-of-money' | 'income-pensions';
export type PensionStep = 'screening' | 'details' | 'contributions';
export type PensionsAction = JourneyAction | 'add' | 'remove' | 'update';
