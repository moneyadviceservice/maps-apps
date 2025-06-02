import {
  MONTHS_IN_YEAR,
  PERSONAL_ALLOWANCE,
  PERSONAL_ALLOWANCE_CAP,
  PERSONAL_ALLOWANCE_REDUCTION_RATIO,
  TAX_BANDS,
  TAX_BANDS_SCOTLAND,
} from '../../CONSTANTS';
import {
  calculateYearlyPay,
  Salary,
} from '../../utils/calculateStatutoryRedundancyPay';
import { Country } from '../../utils/parseStoredData';

export const calculateMonthsWorthOfSalary = (
  redundancyPay: number,
  salary: Salary,
  country: Country,
): number => {
  const netPay = calculateNetPay(salary, country);

  return redundancyPay / (netPay / MONTHS_IN_YEAR);
};

/**
 * Calculates the net pay based on the provided salary and country.
 *
 * @param salary - The salary details of the individual.
 * @param country - The country for which the tax rules should be applied.
 * @returns The net yearly pay after applying personal allowance and taxes.
 */
const calculateNetPay = (salary: Salary, country: Country): number => {
  const yearlyGrossSalary = calculateYearlyPay(salary);
  const personalAllowance = calculatePersonalAllowance(yearlyGrossSalary);
  const taxable = Math.max(0, yearlyGrossSalary - personalAllowance);

  return yearlyGrossSalary - applyTax(taxable, country);
};

/**
 * Calculates the personal allowance based on the yearly gross salary.
 * If the yearly gross salary is less than or equal to the personal allowance cap,
 * the full personal allowance is returned. Otherwise, the allowance is reduced
 * based on the amount exceeding the cap and a reduction ratio.
 *
 * @param yearlyGrossSalary - The yearly gross salary of the individual.
 * @returns The calculated personal allowance after applying reductions, if applicable.
 */
const calculatePersonalAllowance = (yearlyGrossSalary: number): number => {
  if (yearlyGrossSalary <= PERSONAL_ALLOWANCE_CAP) {
    return PERSONAL_ALLOWANCE;
  } else {
    const amountOverCap = yearlyGrossSalary - PERSONAL_ALLOWANCE_CAP;
    const reduction = Math.min(
      amountOverCap / PERSONAL_ALLOWANCE_REDUCTION_RATIO,
      PERSONAL_ALLOWANCE,
    );

    return PERSONAL_ALLOWANCE - reduction;
  }
};

/**
 * Calculates the tax to be applied based on the taxable amount and the country's tax bands.
 *
 * @param taxable - The amount of money that is subject to taxation.
 * @param country - The country for which the tax calculation is performed. Determines the applicable tax bands.
 * @returns The total tax calculated based on the provided taxable amount and country's tax bands.
 */
const applyTax = (taxable: number, country: Country): number => {
  const bands = country === Country.Scotland ? TAX_BANDS_SCOTLAND : TAX_BANDS;

  let tax = 0;

  for (const band of bands) {
    const { min, max } = band.range;
    const rate = band.rate;

    if (taxable > min) {
      const upperBound = Math.min(taxable, max);
      const taxableInBand = upperBound - min;
      tax += taxableInBand * rate;
    }
  }

  return tax;
};
