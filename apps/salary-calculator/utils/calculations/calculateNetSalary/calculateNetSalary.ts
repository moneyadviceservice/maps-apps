import { calculateIncomeTax } from '../../helpers/incomeTax';
import { calculateEmployeeNationalInsurance } from '../../helpers/nationalInsurance';
import { calculatePersonalAllowance } from '../../helpers/personalAllowance';
import type {
  Country,
  SupportedEnglishTaxYear,
  SupportedScottishTaxYear,
} from '../../rates/types';

interface NetSalaryResult {
  incomeTax: number;
  nationalInsurance: number;
  netSalary: number;
}

interface NetSalaryOptions {
  grossSalary: number;
  country: Country;
  taxYear: SupportedEnglishTaxYear | SupportedScottishTaxYear;
}

export function calculateNetSalary({
  grossSalary,
  country,
  taxYear,
}: NetSalaryOptions): NetSalaryResult {
  // Personal Allowance
  const personalAllowance = calculatePersonalAllowance({
    taxYear,
    country,
    taxableAnnualIncome: grossSalary,
  });

  // Income Tax
  const incomeTaxResult = calculateIncomeTax({
    taxYear,
    country,
    taxableAnnualIncome: grossSalary,
    personalAllowance,
  });

  const incomeTax = Number(incomeTaxResult.total.toFixed(2));

  // National Insurance
  const nationalInsurance = Number(
    calculateEmployeeNationalInsurance({
      taxYear,
      country,
      taxableAnnualIncome: grossSalary,
    }).toFixed(2),
  );

  const netSalary = Number(
    (grossSalary - incomeTax - nationalInsurance).toFixed(2),
  );

  return {
    incomeTax,
    nationalInsurance,
    netSalary,
  };
}
