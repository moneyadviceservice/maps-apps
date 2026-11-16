export type Gender = 'MALE' | 'FEMALE';
export type Frequency = 'MONTHLY' | 'ANNUALLY' | 'ONE_OFF';
export type LumpSumAction = 'SPEND' | 'REINVEST' | 'KEEP';
export type Owner = 'MAIN' | 'PARTNER' | 'JOINT';

export interface StateBenefit {
  include: boolean;
  amount: number;
}

export interface User {
  dateOfBirth: string;
  gender: Gender;
  stateBenefit: StateBenefit;
}

export interface Fund {
  code: string;
  contributionPercentage: number;
  balance: number;
}

export interface LumpSum {
  percentage: number;
  lumpSumAction: LumpSumAction;
  dateEventId: string;
}

export interface TieredCharge {
  percentage: number;
}

export interface AnnualCharges {
  tieredCharges: TieredCharge[];
}

export interface Asset {
  id: string;
  typeReference: string;
  funds: Fund[];
  drawdownOrder: number;
  savingsOrder: number;
  lumpSum: LumpSum;
  annualCharges: AnnualCharges;
  owner: Owner;
}

export interface CashflowEvent {
  id: string;
  eventDate: string;
}

export interface ExpenseIncrease {
  basis: string;
}

export interface Expense {
  id: string;
  value: number;
  frequency: Frequency;
  owner: Owner;
  startEventId: string;
  increase: ExpenseIncrease;
}

export interface TaxOptions {
  region: string;
  applyLtaTax: boolean;
}

export interface ForecastOptions {
  terms: number[];
  todaysPrices: boolean;
  todaysPricesIndex: string;
  percentiles: number[];
  taxBasis: string;
  taxOptions: TaxOptions;
  investSurplus: boolean;
  chanceMetExpenses: boolean;
  expenseMetProportion: boolean;
  returnDetailedResults: boolean;
}

export interface CashflowForecastRequest {
  user: User;
  assets: Asset[];
  events: CashflowEvent[];
  expenses: Expense[];
  forecastOptions: ForecastOptions;
}
