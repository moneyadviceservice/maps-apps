import { useState } from 'react';

import { BenefitsCallout } from 'components/BenefitsCallout';
import { ResultsComparisonTableSection } from 'components/ResultsComparisonTableSection/ResultsComparisonTableSection';
import { ResultsHelpText } from 'components/ResultsHelpText';
import { SalaryData } from 'components/ResultsSingleSalary/ResultsSingleSalary';
import { calculateSalaryBreakdown } from 'utils/calculations/calculateSalaryBreakdown';

import { H2, Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import useTranslation from '@maps-react/hooks/useTranslation';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

import type { TaxYear } from '../../utils/rates/types';
import { FrequencySelector } from '../FrequencySelector/FrequencySelector';
import {
  createComparisonColumns,
  createSalaryTableRows,
} from '../ResultsTable/config/salaryTableConfig';
import type { FrequencyType } from '../ResultsTable/ResultsTable';

export interface ResultsComparisonSalaryProps {
  salary1: SalaryData;
  salary2: SalaryData;
  taxYear: TaxYear;
  resultsFrequency: FrequencyType;
}

export const ResultsComparisonSalary = ({
  salary1,
  salary2,
  taxYear,
  resultsFrequency: initialFrequency,
}: ResultsComparisonSalaryProps) => {
  const [resultsFrequency, setResultsFrequency] =
    useState<FrequencyType>(initialFrequency);
  const { z } = useTranslation();

  const breakdown1 = calculateSalaryBreakdown(salary1, taxYear);
  const breakdown2 = calculateSalaryBreakdown(salary2, taxYear);

  const rows = createSalaryTableRows(true, true, true);

  const columns = createComparisonColumns(breakdown1, breakdown2);

  const salary1Amount = breakdown1.netSalary[resultsFrequency];
  const salary2Amount = breakdown2.netSalary[resultsFrequency];

  const difference = salary2Amount - salary1Amount;
  const isSalary2Higher = difference > 0;
  const isEqual = difference === 0;
  const formattedDifference = formatCurrency(Math.abs(difference));

  const frequencyLabels: Record<FrequencyType, string> = {
    yearly: z({ en: 'year', cy: 'blwyddyn' }),
    monthly: z({ en: 'month', cy: 'mis' }),
    weekly: z({ en: 'week', cy: 'wythnos' }),
    daily: z({ en: 'day', cy: 'dydd' }),
  };

  const queryParamsObj = {
    calculationType: 'joint',
    resultsFrequency: String(resultsFrequency),
    // salary 1 (no prefix - parsed without prefix on the page)
    grossIncome: salary1.grossIncome,
    grossIncomeFrequency: String(salary1.grossIncomeFrequency),
    taxCode: salary1.taxCode,
    pensionType: String(salary1.pensionType),
    pensionValue: String(salary1.pensionValue),
    isBlindPerson: String(salary1.isBlindPerson),
    hoursPerWeek: salary1.hoursPerWeek,
    daysPerWeek: salary1.daysPerWeek,
    plan1: String(salary1.studentLoans.plan1),
    plan2: String(salary1.studentLoans.plan2),
    plan4: String(salary1.studentLoans.plan4),
    plan5: String(salary1.studentLoans.plan5),
    planPostGrad: String(salary1.studentLoans.planPostGrad),
    country: String(salary1.country),
    isOverStatePensionAge: String(salary1.isOverStatePensionAge),

    // salary 2 (with salary2_ prefix)
    salary2_grossIncome: salary2.grossIncome,
    salary2_grossIncomeFrequency: String(salary2.grossIncomeFrequency),
    salary2_taxCode: salary2.taxCode,
    salary2_pensionType: String(salary2.pensionType),
    salary2_pensionValue: String(salary2.pensionValue),
    salary2_isBlindPerson: String(salary2.isBlindPerson),
    salary2_hoursPerWeek: salary2.hoursPerWeek,
    salary2_daysPerWeek: salary2.daysPerWeek,
    salary2_plan1: String(salary2.studentLoans.plan1),
    salary2_plan2: String(salary2.studentLoans.plan2),
    salary2_plan4: String(salary2.studentLoans.plan4),
    salary2_plan5: String(salary2.studentLoans.plan5),
    salary2_planPostGrad: String(salary2.studentLoans.planPostGrad),
    salary2_country: String(salary2.country),
    salary2_isOverStatePensionAge: String(salary2.isOverStatePensionAge),
  };

  return (
    <div id="results-comparison">
      <div className="grid grid-cols-12 mb-8">
        {/* HEADING row */}
        <Heading
          level="h1"
          className="col-span-12 text-blue-700 xl:col-span-10"
        >
          {z({
            en: 'Breakdown of take home pay for each salary',
            cy: 'Dadansoddiad o dâl mynd adref ar gyfer pob cyflog',
          })}
        </Heading>

        {/* Description row */}
        <H2 className="text-gray-800 font-normal text-[30px] lg:text-[42px] leading-[42px] mt-6 lg:mt-8 col-span-12">
          {z({
            en: 'Your take home pay difference is',
            cy: 'Eich gwahaniaeth cyflog mynd adref yw',
          })}{' '}
          <span className="font-bold">{formattedDifference}</span>.
        </H2>

        <Paragraph className="text-gray-800 text-[18px] lg:text-[24px] col-span-12">
          {isEqual
            ? z({
                en: 'Both salaries are the same.',
                cy: "Mae'r ddau gyflog yr un peth.",
              })
            : `${
                isSalary2Higher
                  ? z({
                      en: 'Salary 2 is higher than Salary 1 by this amount per',
                      cy: 'Mae cyflog 2 yn uwch na Chyflog 1 gan y swm hwn y',
                    })
                  : z({
                      en: 'Salary 1 is higher than Salary 2 by this amount per',
                      cy: 'Mae cyflog 1 yn uwch na Chyflog 2 gan y swm hwn y',
                    })
              } ${frequencyLabels[resultsFrequency]}.`}
        </Paragraph>

        <div className="hidden col-span-12 lg:block">
          <FrequencySelector
            currentFrequency={resultsFrequency}
            onFrequencyChange={setResultsFrequency}
            formData={queryParamsObj}
            isComparison={true}
          />
        </div>

        <div className="col-span-12 xl:col-span-10">
          <ResultsHelpText className="mt-0 lg:mt-4" />
        </div>

        <div className="col-span-12 -mx-4 border-teal-400 border-[12px] lg:hidden sm:mx-0 rounded-bl-[36px]">
          <div className="col-span-12 px-4 lg:col-span-7 xl:col-span-6">
            <ResultsComparisonTableSection
              resultsFrequency={resultsFrequency}
              setResultsFrequency={setResultsFrequency}
              queryParamsObj={queryParamsObj}
              rows={rows}
              columns={columns}
              showHeading={true}
            />

            <div className="pb-4">
              {(breakdown1.grossSalary.yearly < 37430 ||
                breakdown2.grossSalary.yearly < 37430) && (
                <BenefitsCallout className="self-start col-span-12 p-6 px-10 pt-6 pb-8 mt-6 lg:col-span-5 xl:col-span-4" />
              )}
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden grid-cols-12 col-span-12 gap-6 mt-4 lg:grid lg:mt-4">
          <UrgentCallout
            border="teal"
            variant="mortgage"
            className="col-span-12 p-4 lg:col-span-7 xl:col-span-6"
          >
            <ResultsComparisonTableSection
              resultsFrequency={resultsFrequency}
              setResultsFrequency={setResultsFrequency}
              queryParamsObj={queryParamsObj}
              rows={rows}
              columns={columns}
              showHeading={true}
            />
          </UrgentCallout>
          {(breakdown1.grossSalary.yearly < 37430 ||
            breakdown2.grossSalary.yearly < 37430) && (
            <BenefitsCallout className="self-start col-span-12 p-6 px-10 pt-6 pb-8 lg:col-span-5 xl:col-span-4" />
          )}
        </div>
      </div>
    </div>
  );
};
