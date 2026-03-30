import Decimal from 'decimal.js';
import { getDaysPerWeek } from 'utils/helpers/getDaysPerWeek';

import { calculateIncomeTax } from '../../deductions/incomeTax';
import { calculateEmployeeNationalInsurance } from '../../deductions/nationalInsurance';
import {
  calculateCombinedStudentLoanRepayments,
  CombinedStudentLoanRepayment,
  StudentLoanPlanSelection,
} from '../../deductions/studentLoan';
import { calculatePersonalAllowance } from '../../helpers/personalAllowance';
import type {
  Country,
  SupportedEnglishTaxYear,
  SupportedScottishTaxYear,
} from '../../rates/types';
import {
  calculateFrequencyAmount,
  FrequencyAmount,
} from '../calculateFrequencyAmount';
import { transformTaxCode } from 'utils/helpers/transformTaxCode';

interface NetSalaryResult {
  pensionContributions: number;
  incomeTax: FrequencyAmount;
  nationalInsurance: FrequencyAmount;
  studentLoan: CombinedStudentLoanRepayment;
  netSalary: FrequencyAmount;
  personalAllowance: number;
}

interface NetSalaryOptions {
  grossSalary: number;
  daysPerWeek: number;
  country: Country;
  taxYear: SupportedEnglishTaxYear | SupportedScottishTaxYear;
  employeePensionContributions?: number;
  isOverStatePensionAge: boolean;
  isBlindPerson: boolean;
  taxCode?: string;
  selectedStudentLoanPlans?: StudentLoanPlanSelection;
  hoursPerWeek?: number;
}

export function calculateNetSalary({
  grossSalary,
  daysPerWeek,
  country,
  taxYear,
  employeePensionContributions = 0,
  isOverStatePensionAge = false,
  isBlindPerson = false,
  selectedStudentLoanPlans = [false, false, false, false, false],
  taxCode,
}: NetSalaryOptions): NetSalaryResult {
  const gross = new Decimal(grossSalary);
  const pensionContributions = new Decimal(employeePensionContributions);
  // Subtract pension contributions from gross salary to get taxable salary
  const taxableSalary = gross.minus(pensionContributions).toNumber();
  const upperCode = transformTaxCode(taxCode);
  const isSpecialNoTax = upperCode === 'NT';

  // Personal Allowance
  const personalAllowance = calculatePersonalAllowance({
    taxYear,
    country,
    taxableAnnualIncome: taxableSalary,
    isBlindPerson,
    taxCode,
  });

  // Income Tax
  const incomeTaxResult = isSpecialNoTax
    ? { total: 0 } // override tax to 0 for NT
    : calculateIncomeTax({
        taxYear,
        country,
        taxableAnnualIncome: taxableSalary,
        personalAllowance,
        taxCode,
      });
  const incomeTax = new Decimal(incomeTaxResult.total).toDecimalPlaces(2);

  // National Insurance is calculated on gross salary
  const nationalInsurance = new Decimal(
    calculateEmployeeNationalInsurance({
      taxYear,
      country,
      taxableAnnualIncome: grossSalary,
      isOverStatePensionAge,
    }),
  ).toDecimalPlaces(2);

  const studentLoan = calculateCombinedStudentLoanRepayments({
    taxYear,
    country,
    daysPerWeek,
    taxableAnnualIncome: grossSalary,
    selectedStudentLoanPlans,
  });

  const safeDaysPerWeek = getDaysPerWeek(daysPerWeek);

  const hasStudentLoan = studentLoan.total.yearly !== 0;

  const calculateNetForFrequency = (
    grossAmount: Decimal,
    pensionAmount: Decimal,
    incomeTaxAmount: Decimal,
    nationalInsuranceAmount: Decimal,
    studentLoanAmount: number,
  ): number => {
    return grossAmount
      .minus(pensionAmount)
      .minus(incomeTaxAmount)
      .minus(nationalInsuranceAmount)
      .minus(studentLoanAmount)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      .toNumber();
  };

  const netSalary: FrequencyAmount = hasStudentLoan
    ? {
        yearly: calculateNetForFrequency(
          gross,
          pensionContributions,
          incomeTax,
          nationalInsurance,
          studentLoan.total.yearly,
        ),
        monthly: calculateNetForFrequency(
          gross.div(12),
          pensionContributions.div(12),
          incomeTax.div(12),
          nationalInsurance.div(12),
          studentLoan.total.monthly,
        ),
        weekly: calculateNetForFrequency(
          gross.div(52),
          pensionContributions.div(52),
          incomeTax.div(52),
          nationalInsurance.div(52),
          studentLoan.total.weekly,
        ),
        daily: calculateNetForFrequency(
          gross.div(52 * safeDaysPerWeek),
          pensionContributions.div(52 * safeDaysPerWeek),
          incomeTax.div(52 * safeDaysPerWeek),
          nationalInsurance.div(52 * safeDaysPerWeek),
          studentLoan.total.daily,
        ),
      }
    : calculateFrequencyAmount({
        yearlyAmount: gross
          .minus(pensionContributions)
          .minus(incomeTax)
          .minus(nationalInsurance)
          .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
          .toNumber(),
        daysPerWeek: safeDaysPerWeek,
      });

  return {
    pensionContributions: pensionContributions.toNumber(),
    incomeTax: calculateFrequencyAmount({
      yearlyAmount: incomeTax.toNumber(),
      daysPerWeek: safeDaysPerWeek,
    }),
    nationalInsurance: calculateFrequencyAmount({
      yearlyAmount: nationalInsurance.toNumber(),
      daysPerWeek: safeDaysPerWeek,
    }),
    studentLoan,
    netSalary,
    personalAllowance,
  };
}
