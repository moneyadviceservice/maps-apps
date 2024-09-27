export enum SalaryFrequency {
  YEAR = 1,
  MONTH = 12,
  FOURWEEKS = 13,
  WEEK = 52,
}

enum Contribution {
  MIN_EMPLOYER = 3,
  MIN_TOTAL = 8,
}

enum TaxRelief {
  MAX = 40000,
}

export function getPercentage(rate: number, frequency: number) {
  return rate / 100 / frequency;
}

export type ContributionConditionsResults = {
  salary: number;
  frequency: SalaryFrequency;
  employerContribution: number;
  employeeContribution: number | null;
};

export const contributionConditions = ({
  salary,
  frequency,
  employerContribution,
  employeeContribution,
}: ContributionConditionsResults) => {
  const annaulSalary = salary * frequency;

  return {
    salary: annaulSalary,
    requiredMinimum: getRequiredMinimum(
      employeeContribution,
      employerContribution,
    ),
    employerMinimum: getEmployerMinimum(employerContribution),
    maxTaxRelief: getMaxTaxRelief(annaulSalary, employeeContribution),
  };
};

function getEmployerMinimum(employerContribution: number) {
  return employerContribution < Contribution.MIN_EMPLOYER;
}

function getRequiredMinimum(
  employeeContribution: number | null,
  employerContribution: number,
) {
  if (employeeContribution === null) {
    return true;
  }

  return employeeContribution + employerContribution < Contribution.MIN_TOTAL;
}

function getMaxTaxRelief(salary: number, employeeContribution: number | null) {
  if (employeeContribution === null) return false;
  const interestRate = getPercentage(
    parseFloat(String(employeeContribution)),
    1,
  );
  return salary * interestRate * 1 > TaxRelief.MAX;
}
