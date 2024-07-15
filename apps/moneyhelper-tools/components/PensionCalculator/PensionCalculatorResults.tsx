import { useTranslation } from '@maps-digital/shared/hooks';
import {
  Button,
  H4,
  H5,
  Link,
  Paragraph,
  QuestionOption,
} from '@maps-digital/shared/ui';
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
import { DataFromQuery } from 'utils/pageFilter';
import { ContributionMessage } from './PensionCalculatorDetails';
import { salaryConditions } from 'utils/PensionCalculator/salaryConditions';
import { resultsData } from 'data/workplace-pension-calculator/pension-results';
import { emailResultsFormat } from 'utils/PensionCalculator/emailResults';
import { v4 as uuidv4 } from 'uuid';

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
    Number(String(queryData.salary).replaceAll(',', '')) *
      Number(queryData.frequency),
    queryData.contributionType,
  );

  useEffect(() => {
    setJSEnabled(true);
  }, []);

  return (
    <div
      className="border-gray-200 border-t-[1px] py-2.5"
      data-testid="pension-results"
    >
      <H4 className="text-blue-800">{step.title}</H4>
      <Paragraph
        className="mt-4 print:mb-4 text-gray-400 mb-1"
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
        <div className="print:hidden">{qualifiedEarnings}</div>
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

      {jsEnabled && (
        <PensionCalculatorResultsLinks
          links={links as Record<string, string>}
          emailBody={encodeURIComponent(
            emailResultsFormat(queryData, results, salary, contentResults, z),
          )}
          resetPath={resetPath}
        />
      )}
      <div className="mt-4 print:hidden">
        <H5>{nextStep.title}</H5>
        <ul className="mt-4">
          {nextStep.content.map((value, key) => {
            return (
              <li className="mb-4" key={uuidv4()}>
                <div className="flex md:items-baseline text-md md:text-base">
                  <span className="inline-flex border-green-600 text-green-600 border-[2px] min-w-[34px] w-[34px] h-[34px] items-center justify-center">
                    {key + 1}
                  </span>{' '}
                  <span className="ml-4 text-gray-800">{value}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export const PensionCalculatorResultsLinks = ({
  links,
  emailBody,
  resetPath,
}: {
  links: Record<string, string>;
  emailBody: string;
  resetPath: string;
}) => {
  return (
    <ul className="my-8 print:hidden">
      <li>
        <Link
          data-testid="print"
          href="#top"
          scroll={false}
          onClick={() => window.print()}
          className="mb-3 visited:text-pink-600"
        >
          {links?.print}
        </Link>
      </li>
      <li>
        <Link
          data-testid="link"
          href={`mailto:?body=${emailBody}`}
          className="mb-3 visited:text-pink-600"
        >
          {links?.email}
        </Link>
      </li>
      <li>
        <Link
          data-testid="link"
          href={resetPath}
          className="mb-3 visited:text-pink-600"
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
    <dl className="border-gray-200 border-[1px] p-4">
      <dt className="font-bold mb-1">{contentResults?.employee}</dt>
      <dd className="mb-3">
        <span className="flex">
          £
          <NumericFormat
            value={results.yourContribution}
            thousandSeparator=","
            displayType="text"
          />
        </span>
        <span>
          ({contentResults?.taxRelief} £
          <NumericFormat
            value={results.taxRelief}
            thousandSeparator=","
            displayType="text"
          />
          )
        </span>
        <div className="print:hidden">{taxReliefMessage}</div>
      </dd>

      <dt className="font-bold mb-1">{contentResults?.employer}</dt>
      <dd className="mb-3">
        £
        <NumericFormat
          value={results.employerContribution}
          thousandSeparator=","
          displayType="text"
        />
      </dd>

      <dt className="font-bold mb-1">{contentResults?.total}</dt>
      <dd>
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
