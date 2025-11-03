import Decimal from 'decimal.js';

import { calculateIncomeTax } from '../../deductions/incomeTax';
import { calculateEmployeeNationalInsurance } from '../../deductions/nationalInsurance';
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

interface NetSalaryResult {
  pensionContributions: number;
  incomeTax: FrequencyAmount;
  nationalInsurance: FrequencyAmount;
  netSalary: FrequencyAmount;
}

interface NetSalaryOptions {
  grossSalary: number;
  daysPerWeek: number;
  country: Country;
  taxYear: SupportedEnglishTaxYear | SupportedScottishTaxYear;
  employeePensionContributions?: number;
  isOverStatePensionAge: boolean;
  isBlindPerson: boolean;
}

export function calculateNetSalary({
  grossSalary,
  daysPerWeek,
  country,
  taxYear,
  employeePensionContributions = 0,
  isOverStatePensionAge = false,
  isBlindPerson = false,
}: NetSalaryOptions): NetSalaryResult {
  const gross = new Decimal(grossSalary);

  const pensionContributions = new Decimal(employeePensionContributions);
  // Subtract pension contributions from gross salary to get taxable salary
  const taxableSalary = gross.minus(pensionContributions).toNumber();

  // Personal Allowance
  const personalAllowance = calculatePersonalAllowance({
    taxYear,
    country,
    taxableAnnualIncome: taxableSalary,
    isBlindPerson,
  });

  // Income Tax
  const incomeTaxResult = calculateIncomeTax({
    taxYear,
    country,
    taxableAnnualIncome: taxableSalary,
    personalAllowance,
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

  const netSalary = calculateFrequencyAmount({
    yearlyAmount: gross
      .minus(pensionContributions)
      .minus(incomeTax)
      .minus(nationalInsurance)
      .toDecimalPlaces(2)
      .toNumber(),
    daysPerWeek,
  });

  return {
    pensionContributions: pensionContributions.toNumber(),
    incomeTax: calculateFrequencyAmount({
      yearlyAmount: incomeTax.toNumber(),
      daysPerWeek,
    }),
    nationalInsurance: calculateFrequencyAmount({
      yearlyAmount: nationalInsurance.toNumber(),
      daysPerWeek,
    }),
    netSalary,
  };
}
