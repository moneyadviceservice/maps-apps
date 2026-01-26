import { SalaryData } from 'components/ResultsSingleSalary/ResultsSingleSalary';
import { toStudentLoanPlanSelection } from 'utils/helpers/toStudentLoanPlanSelection';
import { TaxYear } from 'utils/rates/types';

import { getSalaryBreakdown } from '../getSalaryBreakdown';

export const calculateSalaryBreakdown = (
  salary: SalaryData,
  taxYear: TaxYear,
) => {
  const iDaysPerWeek =
    salary.daysPerWeek.trim() === ''
      ? undefined
      : Number.parseInt(salary.daysPerWeek);

  const iHoursPerWeek =
    salary.hoursPerWeek.trim() === ''
      ? undefined
      : Number.parseInt(salary.hoursPerWeek);

  const parsedGrossIncome =
    salary.grossIncome.trim() === ''
      ? 0
      : Number.parseFloat(salary.grossIncome);

  const studentLoanPlans = toStudentLoanPlanSelection(salary.studentLoans);

  return getSalaryBreakdown({
    grossIncome: parsedGrossIncome,
    frequency: salary.grossIncomeFrequency ?? 'annual',
    daysPerWeek: iDaysPerWeek ?? 0,
    hoursPerWeek: iHoursPerWeek,
    pensionType: salary.pensionType,
    pensionValue: salary.pensionValue,
    country: salary.country,
    taxYear,
    studentLoanPlans,
    isOverStatePensionAge: salary.isOverStatePensionAge,
    isBlindPerson: salary.isBlindPerson,
    taxCode: salary.taxCode,
  });
};
