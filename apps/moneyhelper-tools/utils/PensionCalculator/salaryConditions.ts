export enum SalaryFrequency {
  YEAR = 1,
  MONTH = 12,
  FOURWEEKS = 13,
  WEEK = 52,
}

enum OptInThresholdFrequencyLower {
  YEAR = 6240,
  MONTH = 520,
  FOURWEEKS = 480,
  WEEK = 120,
}

enum OptInThresholdFrequencyUpper {
  YEAR = 10000,
  MONTH = 833,
  FOURWEEKS = 768,
  WEEK = 192,
}

enum TaxReliefOnSalaryThreshold {
  YEAR = 12570,
  MONTH = 1047.5,
  FOURWEEKS = 967,
  WEEK = 241.7,
}

export type SalaryConditionResult = {
  belowManualOptIn: boolean;
  manualOptInRequired: boolean;
  nearPensionThreshold: boolean;
  nearAutoEnrollThreshold: boolean;
  belowTaxReliefThreshold: boolean;
};

export const salaryConditions = (
  salary: number,
  frequency: SalaryFrequency,
): SalaryConditionResult => {
  const min = salary > 0;
  return {
    belowManualOptIn: min && belowManualOptIn(salary, frequency),
    manualOptInRequired: min && manualOptInRequired(salary, frequency),
    nearPensionThreshold: min && nearPensionThreshold(salary, frequency),
    nearAutoEnrollThreshold: min && nearAutoEnrollThreshold(salary, frequency),
    belowTaxReliefThreshold: min && belowTaxReliefThreshold(salary, frequency),
  };
};

function manualOptInRequired(salary: number, frequency: SalaryFrequency) {
  const freq = SalaryFrequency[frequency];
  const upper =
    OptInThresholdFrequencyUpper[
      freq as keyof typeof OptInThresholdFrequencyUpper
    ];
  const lower =
    OptInThresholdFrequencyLower[
      freq as keyof typeof OptInThresholdFrequencyLower
    ];

  return salaryInRange(salary, lower, upper);
}

function belowManualOptIn(salary: number, frequency: SalaryFrequency) {
  const freq = SalaryFrequency[frequency];
  const lower =
    OptInThresholdFrequencyLower[
      freq as keyof typeof OptInThresholdFrequencyLower
    ];

  return salary < lower;
}

function belowTaxReliefThreshold(salary: number, frequency: SalaryFrequency) {
  const freq = SalaryFrequency[frequency];
  const threshold =
    TaxReliefOnSalaryThreshold[freq as keyof typeof TaxReliefOnSalaryThreshold];

  return salary < threshold;
}

function nearPensionThreshold(salary: number, frequency: SalaryFrequency) {
  const freq = SalaryFrequency[frequency];
  const lower =
    OptInThresholdFrequencyLower[
      freq as keyof typeof OptInThresholdFrequencyLower
    ];
  return salaryInRange(salary, lower - 10, lower + 10);
}

function nearAutoEnrollThreshold(salary: number, frequency: SalaryFrequency) {
  const freq = SalaryFrequency[frequency];
  const upper =
    OptInThresholdFrequencyUpper[
      freq as keyof typeof OptInThresholdFrequencyUpper
    ];
  return salaryInRange(salary, upper - 10, upper + 10);
}

function salaryInRange(
  salary: number,
  bottomOfRange: number,
  topOfRange: number,
) {
  return salary >= bottomOfRange && salary <= topOfRange;
}
