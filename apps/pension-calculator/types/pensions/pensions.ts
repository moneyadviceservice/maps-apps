import { DEFAULT_FREQUENCY, type FrequencyValue } from 'data/frequency';

export type YesNo = '' | 'yes' | 'no';
export type ContributionMode = 'percentage' | 'fixed';

export type DefinedContributionPot = {
  name: string;
  currentValue: string;
  taxFreeCash: string;
};

export type Contribution = {
  mode: ContributionMode;
  value: string;
  frequency: FrequencyValue;
};

export type PotsOfMoneyData = {
  hasPotOfMoneyPension: YesNo;
  pots: DefinedContributionPot[];
  employeeContribution: Contribution;
  employerContribution: Contribution;
  annualManagementCharge: string;
};

export type PotsOfMoneyErrors = Record<string, string[]>;

export const emptyPot = (): DefinedContributionPot => ({
  name: '',
  currentValue: '',
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
  employeeContribution: emptyContribution(),
  employerContribution: emptyContribution(),
  annualManagementCharge: '',
});
