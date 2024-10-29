import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Button, H2, H3, Link, Paragraph } from '@maps-digital/shared/ui';
import { QuestionOption } from '@maps-react/form/components/QuestionRadioButton';
import { PENSION_CALCULATOR_API } from 'CONSTANTS';
import { Select } from 'components/Select';
import { Fields, Step } from 'data/workplace-pension-calculator';
import {
  PensionInput,
  StepName,
} from 'data/workplace-pension-calculator/pension-data';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import {
  ContributionCalculatorResults,
  ContributionType,
  SalaryFrequency,
  calculateSalary,
} from 'utils/PensionCalculator/contributionCalculator';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { ContributionMessage } from './PensionCalculatorDetails';
import { salaryConditions } from 'utils/PensionCalculator/salaryConditions';
import { resultsData } from 'data/workplace-pension-calculator/pension-results';
import { emailResultsFormat } from 'utils/PensionCalculator/emailResults';

export const PensionCalculatorResults = ({
  queryData,
  results,
  resetPath,
  step,
}: {
  queryData: DataFromQuery;
  results: ContributionCalculatorResults;
  resetPath: string;
  step: Step;
}) => {
  const { z } = useTranslation();
  const router = useRouter();
  const [jsEnabled, setJSEnabled] = useState(false);
  const field = (step.fields as Fields[]).find(
    (f) => f.name === PensionInput.FREQUENCY,
  );

  const resultsContent = useMemo(() => resultsData(z), [z]);
  const defaultFrequency =
    queryData.results !== 'undefined' && queryData.results !== undefined
      ? queryData.results
      : field?.defaultValue;

  const {
    links,
    taxReliefMessage,
    taxReliefEarningMessage,
    qualifiedEarnings,
    nextStep,
    description,
    resultFrequency,
    resultContributionType,
  } = resultsContent;

  const contentResults = resultFrequency[Number(defaultFrequency)];
  const contributionType = resultContributionType[queryData.contributionType];

  const salaryCondition = salaryConditions(
    Number(queryData.salary.replaceAll(',', '')),
    Number(queryData.frequency) as SalaryFrequency,
  );

  const salary = calculateSalary(
    Number(String(queryData.salary).replaceAll(/,/g, '')) *
      Number(queryData.frequency),
    queryData.contributionType,
  );

  useEffect(() => {
    setJSEnabled(true);
  }, []);

  return (
    <div
      className="border-gray-200 border-t-[1px] py-2.5 lg:max-w-[640px]"
      data-testid="pension-results"
    >
      <H2 className="text-2xl" color="text-blue-800">
        {step.title}
      </H2>
      <Paragraph
        className="mt-4 print:mb-4 text-gray-400 mb-1 text-sm"
        data-testid="results-message"
      >
        {contributionType} £
        <NumericFormat
          value={salary}
          thousandSeparator=","
          displayType="text"
        />{' '}
        {description}.
      </Paragraph>
      {queryData.contributionType === ContributionType.PART && (
        <div className="print:hidden text-sm">{qualifiedEarnings}</div>
      )}

      {(salaryCondition.belowManualOptIn ||
        salaryCondition.manualOptInRequired) && (
        <ContributionMessage>{taxReliefEarningMessage}</ContributionMessage>
      )}

      <div className="md:flex my-6 items-center bg-gray-200 p-4 print:hidden">
        <label
          htmlFor="salary"
          className="block font-bold mb-2 md:mr-4 md:mb-0"
        >
          {field?.label}
        </label>
        <div className="flex">
          <Select
            hideEmptyItem={true}
            className="min-w-[180px]"
            aria-label={z({
              en: 'Frequency',
              cy: 'Amlder',
            })}
            name="results"
            id="results"
            data-testid="results"
            onChange={(e) => {
              router.push(
                {
                  pathname: router.route,
                  query: {
                    ...router.query,
                    results: e.target.value,
                    currentStep: StepName.RESULTS,
                  },
                },
                undefined,
                { scroll: false },
              );
            }}
            defaultValue={defaultFrequency}
            options={field?.options as QuestionOption[]}
          />
        </div>

        {!jsEnabled && (
          <Button
            className="ml-2"
            variant="primary"
            formAction={PENSION_CALCULATOR_API}
            id="submit"
          >
            {step.buttonText}
          </Button>
        )}
      </div>

      <PensionCalculatorResultsSummary
        contentResults={contentResults}
        taxReliefMessage={taxReliefMessage}
        results={results}
      />

      <PensionCalculatorResultsLinks
        links={links as Record<string, string>}
        jsEnabled={jsEnabled}
        emailBody={encodeURIComponent(
          emailResultsFormat(queryData, results, salary, contentResults, z),
        )}
        resetPath={resetPath}
      />

      <div className="mt-4 print:hidden">
        <H3 className="text-xl text-gray-800 font-bold">{nextStep.title}</H3>
        <ol className="mt-4 ml-8 marker:font-bold list-decimal marker:text-blue-800 marker:mr-2 marker:pr-2 space-y-2 marker:leading-snug">
          {nextStep.content.map((content) => {
            return (
              <li key={content.name}>
                <p className="text-gray-800">{content.value}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export const PensionCalculatorResultsLinks = ({
  links,
  emailBody,
  resetPath,
  jsEnabled,
}: {
  links: Record<string, string>;
  emailBody: string;
  resetPath: string;
  jsEnabled: boolean;
}) => {
  return (
    <ul className="my-8 print:hidden">
      {jsEnabled && (
        <li>
          <Link
            data-testid="print"
            href="#top"
            scroll={false}
            onClick={() => window.print()}
            className="mb-3 visited:text-pink-600 text-sm"
          >
            {links?.print}
          </Link>
        </li>
      )}
      {jsEnabled && (
        <li>
          <Link
            data-testid="link"
            href={`mailto:?body=${emailBody}`}
            className="mb-3 visited:text-pink-600 text-sm"
          >
            {links?.email}
          </Link>
        </li>
      )}
      <li>
        <Link
          data-testid="link"
          href={resetPath}
          className="mb-3 visited:text-pink-600 text-sm"
        >
          {links?.reset}
        </Link>
      </li>
    </ul>
  );
};

export const PensionCalculatorResultsSummary = ({
  contentResults,
  taxReliefMessage,
  results,
}: {
  contentResults: Record<string, string>;
  taxReliefMessage: ReactNode;
  results: ContributionCalculatorResults;
}) => {
  return (
    <dl className="border-gray-200 border-[1px] p-4" aria-live="polite">
      <dt className="font-bold mb-1 text-sm">{contentResults?.employee}</dt>
      <dd className="mb-3 text-sm">
        <span className="flex">
          £
          <NumericFormat
            value={results.yourContribution}
            thousandSeparator=","
            displayType="text"
          />
        </span>
        <span className="text-sm">
          ({contentResults?.taxRelief} £
          <NumericFormat
            value={results.taxRelief}
            thousandSeparator=","
            displayType="text"
          />
          )
        </span>
        <div className="print:hidden text-sm">{taxReliefMessage}</div>
      </dd>

      <dt className="font-bold text-sm mb-1">{contentResults?.employer}</dt>
      <dd className="mb-3 text-sm">
        £
        <NumericFormat
          value={results.employerContribution}
          thousandSeparator=","
          displayType="text"
        />
      </dd>

      <dt className="font-bold mb-1 text-sm">{contentResults?.total}</dt>
      <dd className="text-sm">
        £
        <NumericFormat
          value={results.totalContribution}
          thousandSeparator=","
          displayType="text"
        />
      </dd>
    </dl>
  );
};
