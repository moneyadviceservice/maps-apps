import type { SalaryFormData } from 'components/SalaryForm';
import { isEmergencyTaxCode } from 'utils/helpers/isEmergencyTaxCode';

import type { TaxYear } from '../../../utils/rates/types';
import { EmergencyTaxCodeCallout } from '../EmergencyTaxCodeCallout';
import { HighEarningsCallout } from '../HighEarningsCallout';
import { isBelowMinimumWage, MinimumWageCallout } from '../MinimumWageCallout';
import { isTaxCapApplied, TaxCapCallout } from '../TaxCapCallout';
import { isTaxReliefApplicable, TaxReliefCallout } from '../TaxReliefCallout';
import {
  isOverWorkingHoursLimit,
  WorkingHoursCallout,
} from '../WorkingHoursCallout';

type SalaryCalloutData = Pick<
  SalaryFormData,
  | 'grossIncome'
  | 'grossIncomeFrequency'
  | 'hoursPerWeek'
  | 'taxCode'
  | 'pensionValue'
  | 'employerPensionValue'
  | 'country'
>;

type SalaryCalloutEligibilityProps = {
  salary: SalaryCalloutData;
  yearlyGrossIncome: number;
  uncappedIncomeTax: number;
  taxYear: TaxYear;
};

type SalaryCalloutsProps = SalaryCalloutEligibilityProps & {
  className: string;
  isEmbed?: boolean;
  showSkipToResults?: boolean;
};

const getEligibleCallouts = ({
  salary,
  yearlyGrossIncome,
  uncappedIncomeTax,
  taxYear,
  className,
  isEmbed,
}: SalaryCalloutsProps) => {
  const taxReliefProps = {
    grossIncome: yearlyGrossIncome,
    employeePensionValue: salary.pensionValue,
    employerPensionValue: salary.employerPensionValue,
    isScottishTaxPayer: salary.country === 'Scotland',
    taxYear,
  };

  return [
    {
      isEligible: isBelowMinimumWage(salary),
      render: (showSkip: boolean) => (
        <MinimumWageCallout
          key="minimum-wage"
          salary={salary}
          className={className}
          showSkipToResults={showSkip}
        />
      ),
    },
    {
      isEligible: isOverWorkingHoursLimit(salary),
      render: (showSkip: boolean) => (
        <WorkingHoursCallout
          key="working-hours"
          salary={salary}
          className={className}
          showSkipToResults={showSkip}
        />
      ),
    },
    {
      isEligible: isEmergencyTaxCode(salary.taxCode),
      render: (showSkip: boolean) => (
        <EmergencyTaxCodeCallout
          key="emergency-tax-code"
          taxCode={salary.taxCode}
          className={className}
          showSkipToResults={showSkip}
        />
      ),
    },
    {
      isEligible: isTaxCapApplied(yearlyGrossIncome, uncappedIncomeTax),
      render: (showSkip: boolean) => (
        <TaxCapCallout
          key="tax-cap"
          grossIncome={yearlyGrossIncome}
          uncappedIncomeTax={uncappedIncomeTax}
          className={className}
          showSkipToResults={showSkip}
        />
      ),
    },
    {
      isEligible:
        Number(yearlyGrossIncome) >= 100000 && salary.taxCode === '1257L',
      render: (showSkip: boolean) => (
        <HighEarningsCallout
          key="high-earnings"
          grossIncome={String(yearlyGrossIncome)}
          taxCode={salary.taxCode}
          isEmbed={isEmbed}
          className={className}
          showSkipToResults={showSkip}
        />
      ),
    },
    {
      isEligible: isTaxReliefApplicable(taxReliefProps),
      render: (showSkip: boolean) => (
        <TaxReliefCallout
          key="tax-relief"
          {...taxReliefProps}
          className={className}
          showSkipToResults={showSkip}
        />
      ),
    },
  ].filter(({ isEligible }) => isEligible);
};

export const hasSalaryCallouts = (props: SalaryCalloutEligibilityProps) =>
  getEligibleCallouts({ ...props, className: '' }).length > 0;

export const SalaryCallouts = (props: SalaryCalloutsProps) => {
  const callouts = getEligibleCallouts(props).slice(0, 2);

  return (
    <>
      {callouts.map(({ render }, index) =>
        render(
          Boolean(props.showSkipToResults && index === callouts.length - 1),
        ),
      )}
    </>
  );
};
