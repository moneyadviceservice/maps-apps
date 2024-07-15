export enum SalaryFrequency {
  YEAR = 1,
  MONTH = 12,
  FOURWEEKS = 13,
  WEEK = 52,
}

enum SalaryThreshold {
  UPPER = 50270,
  LOWER = 6240,
}

enum TaxReliefPercentage {
  DEFAULT = 20,
}

enum TaxReliefThreshold {
  YEAR = 8000.04,
  MONTH = 666.67,
  FOURWEEKS = 615.39,
  WEEK = 153.85,
}

export enum ContributionType {
  FULL = 'full',
  PART = 'part',
}

interface ContributionCalculator {
  salary: number;
  frequency: SalaryFrequency;
  contributionType: ContributionType;
  employeeContribution: number;
  employerContribution: number;
}

export interface ContributionCalculatorResults {
  yourContribution: string;
  taxRelief: string;
  employerContribution: string;
  totalContribution: string;
}

export const contributionCalculator = ({
  salary,
  frequency,
  contributionType,
  employeeContribution,
  employerContribution,
}: ContributionCalculator): ContributionCalculatorResults => {
  salary = calculateSalary(salary, contributionType);

  const calculatePercentEmployee = getContribution(
    salary,
    employeeContribution,
  );
  const calculatePercentEmployer = getContribution(
    salary,
    employerContribution,
  );

  return {
    yourContribution: (calculatePercentEmployee / frequency).toFixed(2),
    taxRelief: getTaxRelief(calculatePercentEmployee / frequency, frequency),
    employerContribution: (calculatePercentEmployer / frequency).toFixed(2),
    totalContribution: (
      Number((calculatePercentEmployee / frequency).toFixed(2)) +
      Number((calculatePercentEmployer / frequency).toFixed(2))
    ).toFixed(2),
  };
};

function getTaxRelief(
  calculatePercentEmployee: number,
  frequency: SalaryFrequency,
) {
  const result =
    calculatePercentEmployee * ((TaxReliefPercentage.DEFAULT / 100) * 1);
  const freq = SalaryFrequency[frequency] as keyof typeof TaxReliefThreshold;
  return Math.min(result, TaxReliefThreshold[freq]).toFixed(2);
}

export function calculateSalary(
  salary: number,
  contributionType: ContributionType,
) {
  if (contributionType === ContributionType.FULL) {
    return salary;
  }

  if (salary > SalaryThreshold.UPPER) {
    return SalaryThreshold.UPPER - SalaryThreshold.LOWER;
  }

  if (salary < SalaryThreshold.LOWER) {
    return salary;
  }

  return salary - SalaryThreshold.LOWER;
}

function getPercentage(rate: number) {
  return rate / 100 / 1;
}

function getContribution(salary: number, percent: number) {
  const interestRate = getPercentage(parseFloat(String(percent)));
  return salary * interestRate * 1;
}
