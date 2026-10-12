import {
  CombinedStudentLoanRepayment,
  StudentLoanPlanSelection,
} from 'utils/deductions/studentLoan';
import { getDaysPerWeek } from 'utils/helpers/getDaysPerWeek';
import { Country } from 'utils/rates';
import {
  DEFAULT_TAX_CODE_ENGLAND,
  DEFAULT_TAX_CODE_SCOTLAND,
} from 'utils/rates/constants';
import { TaxYear } from 'utils/rates/types';

import { calculatePensionContributions } from '../../deductions/pensionContributions/pensionContributions';
import { convertToAnnualSalary } from '../../helpers/convertToAnnualSalary';
import {
  calculateFrequencyAmount,
  FrequencyAmount,
} from '../calculateFrequencyAmount';
import { calculateNetSalary } from '../calculateNetSalary';

export type SalaryFrequency =
  | 'annual'
  | 'monthly'
  | 'weekly'
  | 'daily'
  | 'hourly';

export type PensionContributionType = 'percentage' | 'fixed';

export interface SalaryBreakdownInput {
  grossIncome: number;
  frequency: SalaryFrequency;
  daysPerWeek: number;
  hoursPerWeek?: number;
  pensionType: PensionContributionType;
  pensionValue: number;
  employerPensionType?: PensionContributionType;
  employerPensionValue?: number;
  country: Country;
  taxYear: TaxYear;
  isOverStatePensionAge?: boolean;
  isBlindPerson?: boolean;
  studentLoanPlans?: StudentLoanPlanSelection;
  taxCode?: string;
}

export interface SalaryBreakdownOutput {
  grossSalary: FrequencyAmount;
  employeePensionContributions: FrequencyAmount;
  employerPensionContributions: FrequencyAmount;
  incomeTax: FrequencyAmount;
  nationalInsurance: FrequencyAmount;
  studentLoan: CombinedStudentLoanRepayment;
  netSalary: FrequencyAmount;
  personalAllowance: number;
  totalDeductions: FrequencyAmount;
}

export function getSalaryBreakdown({
  grossIncome,
  frequency,
  daysPerWeek,
  hoursPerWeek,
  pensionType,
  pensionValue,
  employerPensionType = 'percentage',
  employerPensionValue = 0,
  country,
  taxYear,
  studentLoanPlans,
  isOverStatePensionAge,
  isBlindPerson,
  taxCode,
}: SalaryBreakdownInput): SalaryBreakdownOutput {
  const annualSalary = convertToAnnualSalary({
    grossIncome,
    frequency,
    daysPerWeek,
    hoursPerWeek,
  });

  const safeDaysPerWeek = getDaysPerWeek(daysPerWeek);

  const employeePensionContributions = calculateFrequencyAmount({
    yearlyAmount: calculatePensionContributions(
      annualSalary,
      pensionType,
      pensionValue,
    ),
    daysPerWeek: safeDaysPerWeek,
  });

  // Employer contributions are shown alongside the employee's but never deducted from pay
  const employerPensionContributions = calculateFrequencyAmount({
    yearlyAmount: calculatePensionContributions(
      annualSalary,
      employerPensionType,
      employerPensionValue,
    ),
    daysPerWeek: safeDaysPerWeek,
  });

  const defaultTaxCode =
    country === 'England/NI/Wales'
      ? DEFAULT_TAX_CODE_ENGLAND
      : DEFAULT_TAX_CODE_SCOTLAND;

  const {
    incomeTax,
    nationalInsurance,
    studentLoan,
    netSalary,
    personalAllowance,
  } = calculateNetSalary({
    grossSalary: annualSalary,
    country,
    taxYear,
    employeePensionContributions: employeePensionContributions.yearly,
    isOverStatePensionAge: isOverStatePensionAge ?? false,
    daysPerWeek: safeDaysPerWeek,
    isBlindPerson: isBlindPerson ?? false,
    selectedStudentLoanPlans: studentLoanPlans ?? [
      false,
      false,
      false,
      false,
      false,
    ],
    taxCode: taxCode ?? defaultTaxCode,
  });

  const grossSalary = calculateFrequencyAmount({
    yearlyAmount: annualSalary,
    daysPerWeek: safeDaysPerWeek,
  });

  const linearDeductions = calculateFrequencyAmount({
    yearlyAmount:
      employeePensionContributions.yearly +
      incomeTax.yearly +
      nationalInsurance.yearly,
    daysPerWeek: safeDaysPerWeek,
  });

  const totalDeductionsAmount = {
    yearly: linearDeductions.yearly + studentLoan.total.yearly,
    monthly: linearDeductions.monthly + studentLoan.total.monthly,
    weekly: linearDeductions.weekly + studentLoan.total.weekly,
    daily: linearDeductions.daily + studentLoan.total.daily,
  };

  return {
    grossSalary,
    employeePensionContributions,
    employerPensionContributions,
    incomeTax,
    nationalInsurance,
    studentLoan,
    netSalary,
    personalAllowance,
    totalDeductions: totalDeductionsAmount,
  };
}
