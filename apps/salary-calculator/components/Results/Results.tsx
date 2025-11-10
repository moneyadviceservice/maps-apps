import { getSalaryBreakdown } from 'utils/calculations/getSalaryBreakdown';
import type { PensionContributionType } from 'utils/calculations/getSalaryBreakdown/getSalaryBreakdown';
import { PayFrequency } from 'utils/helpers/convertToAnnualSalary/convertToAnnualSalary';
import { Country } from 'utils/rates';
import { TaxYear } from 'utils/rates/types';

interface SalaryCalculatorResultsProps {
  grossIncome: string;
  grossIncomeFrequency: PayFrequency;
  hoursPerWeek: string;
  daysPerWeek: string;
  taxCode: string;
  isBlindPerson: boolean;
  pensionType: PensionContributionType;
  pensionValue: number;
  country: Country;
  taxYear: TaxYear;
  isOverStatePensionAge: boolean;
}

export const SalaryCalculatorResults = ({
  grossIncome,
  grossIncomeFrequency,
  hoursPerWeek,
  daysPerWeek,
  taxCode,
  isBlindPerson,
  pensionType,
  pensionValue,
  country,
  taxYear,
  isOverStatePensionAge,
}: SalaryCalculatorResultsProps) => {
  const iDaysPerWeek =
    daysPerWeek.trim() === '' ? undefined : Number.parseInt(daysPerWeek);
  const iHoursPerWeek =
    hoursPerWeek.trim() === '' ? undefined : Number.parseInt(hoursPerWeek);
  const parsedGrossIncome =
    grossIncome.trim() === '' ? 0 : Number.parseFloat(grossIncome);

  const {
    annualSalary,
    employeePensionContributions,
    incomeTax,
    nationalInsurance,
    netSalary,
  } = getSalaryBreakdown({
    grossIncome: parsedGrossIncome,
    frequency: grossIncomeFrequency ?? 'annual',
    daysPerWeek: iDaysPerWeek ?? 0,
    hoursPerWeek: iHoursPerWeek,
    pensionType,
    pensionValue: pensionValue,
    country,
    taxYear,
    isOverStatePensionAge,
    isBlindPerson,
    taxCode,
  });

  function displayAmount(title: string, amount: number) {
    return [
      `${title}: £`,
      amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ].join('');
  }
  return (
    <div>
      {' '}
      <div className="p-4 space-y-1 " id="calculate">
        <h1 className="text-lg font-bold">Example Calculation</h1>
        <p>Annual salary: £{annualSalary.toLocaleString()}</p>
        <p>Country: {country}</p>
        <p>Tax Code: {taxCode}</p>

        <h2 className="pt-4 font-bold">Annual Breakdown</h2>
        <p>{displayAmount('Income tax', incomeTax.yearly)}</p>
        <p>{displayAmount('National insurance', nationalInsurance.yearly)}</p>
        <p>
          {displayAmount(
            'Pension contributions',
            employeePensionContributions.yearly,
          )}
        </p>
        <p>{displayAmount('Net salary', netSalary.yearly)}</p>

        <h2 className="pt-4 font-bold">Monthly Breakdown</h2>
        <p>{displayAmount('Income tax', incomeTax.monthly)}</p>
        <p>{displayAmount('National insurance', nationalInsurance.monthly)}</p>
        <p>
          {displayAmount(
            'Pension contributions',
            employeePensionContributions.monthly,
          )}
        </p>
        <p>{displayAmount('Net salary', netSalary.monthly)}</p>

        <h2 className="pt-4 font-bold">Weekly Breakdown</h2>
        <p>{displayAmount('Income tax', incomeTax.weekly)}</p>
        <p>{displayAmount('National insurance', nationalInsurance.weekly)}</p>
        <p>
          {displayAmount(
            'Pension contributions',
            employeePensionContributions.weekly,
          )}
        </p>
        <p>{displayAmount('Net salary', netSalary.weekly)}</p>

        <h2 className="pt-4 font-bold">Daily Breakdown</h2>
        <p>{displayAmount('Income tax', incomeTax.daily)}</p>
        <p>{displayAmount('National insurance', nationalInsurance.daily)}</p>
        <p>
          {displayAmount(
            'Pension contributions',
            employeePensionContributions.daily,
          )}
        </p>
        <p>{displayAmount('Net salary', netSalary.daily)}</p>
      </div>
    </div>
  );
};
