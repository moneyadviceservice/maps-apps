export type PensionType = 'DC' | 'DB';
export type CurrencyString = `£${string}`;

/**
 * If any of the these values are set to null or missing, the test will assume they are 'unavailable'
 *
 * Preferably, we should have strictNullChecks enabled in the tsconfig.
 */

export interface BarData {
  yearly: CurrencyString;
  monthly: CurrencyString;
}

export interface BarChartData {
  // Expected year under the latest value bar
  retirementIllustrationYear: string | null;
  // Expected year under the illustration bar
  latestIllustrationYear: string | null;
  latestValues: BarData | null;
  estimateAtRetirement: BarData | null;
}

export interface DoughnutChartData {
  // Expected year under the latest value doughnut
  retirementIllustrationYear: string | null;
  // Expected year under the illustration doughnut
  latestIllustrationYear: string | null;
  latestValue: CurrencyString | null;
  estimateAtRetirement: CurrencyString | null;
}

export interface Pension {
  schemeName: string;
  pensionType: PensionType;
  pensionProvider: string;
  employerName?: string;
  referenceNumber: string | null;
  retirementYear: string | null;
  barChartData: BarChartData;
  doughnutChartData: DoughnutChartData | null;
  payableDateERI?: string | null;
  dataIllustrationDate: string | null;
  status?: string | null;
  type?: string | null;
}

export interface ChartScenario {
  option: string;
  pensions: Array<Pension>;
}
