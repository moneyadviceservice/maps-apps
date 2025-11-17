import {
  CombinedStudentLoanRepayment,
  StudentLoanPlanSelection,
} from 'utils/deductions/studentLoan';
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
  country: Country;
  taxYear: TaxYear;
  isOverStatePensionAge?: boolean;
  isBlindPerson?: boolean;
  studentLoanPlans?: StudentLoanPlanSelection;
  taxCode?: string;
}

export interface SalaryBreakdownOutput {
  annualSalary: number;
  employeePensionContributions: FrequencyAmount;
  incomeTax: FrequencyAmount;
  nationalInsurance: FrequencyAmount;
  studentLoan: CombinedStudentLoanRepayment;
  netSalary: FrequencyAmount;
}

export function getSalaryBreakdown({
  grossIncome,
  frequency,
  daysPerWeek,
  hoursPerWeek,
  pensionType,
  pensionValue,
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

  const employeePensionContributions = calculateFrequencyAmount({
    yearlyAmount: calculatePensionContributions(
      annualSalary,
      pensionType,
      pensionValue,
    ),
    daysPerWeek: daysPerWeek,
  });

  const defaultTaxCode =
    country === 'England/NI/Wales'
      ? DEFAULT_TAX_CODE_ENGLAND
      : DEFAULT_TAX_CODE_SCOTLAND;

  const { incomeTax, nationalInsurance, studentLoan, netSalary } =
    calculateNetSalary({
      grossSalary: annualSalary,
      country,
      taxYear,
      employeePensionContributions: employeePensionContributions.yearly,
      isOverStatePensionAge: isOverStatePensionAge ?? false,
      daysPerWeek: daysPerWeek,
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

  return {
    annualSalary,
    employeePensionContributions,
    incomeTax,
    nationalInsurance,
    studentLoan,
    netSalary,
  };
}
