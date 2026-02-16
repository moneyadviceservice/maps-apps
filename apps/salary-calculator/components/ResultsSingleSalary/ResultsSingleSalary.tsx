import { useState } from 'react';

import { ResultsSingleTableSection } from 'components/ResultsSingleTableSection/ResultsSingleTableSection';
import { calculateSalaryBreakdown } from 'utils/calculations/calculateSalaryBreakdown';

import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import type { StudentLoans } from '../../types';
import { type PensionContributionType } from '../../utils/calculations/getSalaryBreakdown/getSalaryBreakdown';
import type { PayFrequency } from '../../utils/helpers/convertToAnnualSalary/convertToAnnualSalary';
import type { Country } from '../../utils/rates';
import type { TaxYear } from '../../utils/rates/types';
import {
  createSalaryTableRows,
  createSingleSalaryColumn,
} from '../ResultsTable/config/salaryTableConfig';
import type { FrequencyType } from '../ResultsTable/ResultsTable';

export interface SalaryData {
  grossIncome: string;
  grossIncomeFrequency: PayFrequency;
  hoursPerWeek: string;
  daysPerWeek: string;
  taxCode: string;
  isBlindPerson: boolean;
  pensionType: PensionContributionType;
  pensionValue: number;
  studentLoans: StudentLoans;
  country: Country;
  isOverStatePensionAge: boolean;
}

export interface SalaryCalculatorResultsProps {
  salary: SalaryData;
  taxYear: TaxYear;
  resultsFrequency: FrequencyType;
}

export const ResultsSingleSalary = ({
  salary,
  taxYear,
  resultsFrequency: initialFrequency,
}: SalaryCalculatorResultsProps) => {
  const { z } = useTranslation();
  const [resultsFrequency, setResultsFrequency] =
    useState<FrequencyType>(initialFrequency);

  const breakdown = calculateSalaryBreakdown(salary, taxYear);

  const queryParamsObj = {
    calculationType: 'single',
    resultsFrequency: String(resultsFrequency),
    grossIncome: salary.grossIncome,
    grossIncomeFrequency: String(salary.grossIncomeFrequency),
    taxCode: salary.taxCode,
    pensionType: String(salary.pensionType),
    pensionValue: String(salary.pensionValue),
    isBlindPerson: String(salary.isBlindPerson),
    hoursPerWeek: salary.hoursPerWeek,
    daysPerWeek: salary.daysPerWeek,
    plan1: String(salary.studentLoans.plan1),
    plan2: String(salary.studentLoans.plan2),
    plan4: String(salary.studentLoans.plan4),
    plan5: String(salary.studentLoans.plan5),
    planPostGrad: String(salary.studentLoans.planPostGrad),
    country: String(salary.country),
    isOverStatePensionAge: String(salary.isOverStatePensionAge),
  };

  // Create table configuration
  const rows = createSalaryTableRows(true, false, false);
  const columns = createSingleSalaryColumn(breakdown);

  const getFrequencyText = (frequency: FrequencyType) => {
    const frequencyMap: Record<FrequencyType, { en: string; cy: string }> = {
      yearly: { en: 'a year', cy: 'y flwyddyn' },
      monthly: { en: 'a month', cy: 'y mis' },
      weekly: { en: 'a week', cy: 'yr wythnos' },
      daily: { en: 'a day', cy: 'y diwrnod' },
    };

    return frequencyMap[frequency];
  };

  const displayAmount = (amount: number) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const netSalaryPercentage = Number(
    (
      (breakdown.netSalary[resultsFrequency] /
        breakdown.grossSalary[resultsFrequency]) *
      100
    ).toFixed(1),
  );

  const deductionsPercentage = Number((100 - netSalaryPercentage).toFixed(1));

  const pieData = [
    {
      name: z({ en: 'Take home', cy: 'Mynd adref' }),
      percentage: netSalaryPercentage,
      colour: '#6FD8D8',
    },
    {
      name: z({ en: 'Deductions', cy: 'Didyniadau' }),
      percentage: deductionsPercentage,
      colour: '#00788F',
    },
  ];

  return (
    <div id="results" data-testid="results-section">
      {/* Mobile view from 320px to 1023 */}
      <div className="block lg:hidden border-[12px] border-teal-300 -mx-4 p-4 rounded-bl-[36px]">
        <ResultsSingleTableSection
          resultsFrequency={resultsFrequency}
          setResultsFrequency={setResultsFrequency}
          queryParamsObj={queryParamsObj}
          rows={rows}
          columns={columns}
          netAmount={displayAmount(breakdown.netSalary[resultsFrequency])}
          frequencyText={z(getFrequencyText(resultsFrequency))}
          pieData={pieData}
          showBenefitsCallout={breakdown.grossSalary.yearly < 37430}
        />
      </div>

      {/* Tablet and Desktop view from 1023px and above */}
      <div className="hidden lg:block">
        <UrgentCallout border="teal" variant="mortgage">
          <ResultsSingleTableSection
            resultsFrequency={resultsFrequency}
            setResultsFrequency={setResultsFrequency}
            queryParamsObj={queryParamsObj}
            rows={rows}
            columns={columns}
            netAmount={displayAmount(breakdown.netSalary[resultsFrequency])}
            frequencyText={z(getFrequencyText(resultsFrequency))}
            pieData={pieData}
            showBenefitsCallout={breakdown.grossSalary.yearly < 37430}
          />
        </UrgentCallout>
      </div>
    </div>
  );
};
