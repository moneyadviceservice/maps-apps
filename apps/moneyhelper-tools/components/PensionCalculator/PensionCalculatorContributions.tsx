import { Fields, Step } from 'data/workplace-pension-calculator';
import { DataFromQuery } from 'utils/pageFilter';
import {
  Errors,
  ExpandableSection,
  H4,
  Link,
  Paragraph,
} from '@maps-digital/shared/ui';
import { PercentInput } from 'components/PercentInput';
import {
  ContributionType,
  SalaryFrequency,
  calculateSalary,
} from 'utils/PensionCalculator/contributionCalculator';
import { ErrorObject } from 'data/workplace-pension-calculator/pension-validation';
import { NumericFormat } from 'react-number-format';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from '@maps-digital/shared/hooks';
import {
  ContributionMessage,
  PensionCalculatorErrors,
} from './PensionCalculatorDetails';
import { twMerge } from 'tailwind-merge';
import { contributionConditions } from 'utils/PensionCalculator/contributionConditions';
import { contributionData } from 'data/workplace-pension-calculator/pension-contributions';
import { salaryConditions } from 'utils/PensionCalculator/salaryConditions';

export const PensionCalculatorContributions = ({
  stepCompleted,
  queryData,
  editPath,
  step,
  errors,
  onChange,
  onEdit,
}: {
  stepCompleted: boolean;
  queryData: DataFromQuery;
  editPath: string;
  step: Step;
  errors: ErrorObject;
  onChange: (e: FormEvent<HTMLInputElement>) => void;
  onEdit: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const { z } = useTranslation();
  const contribution = contributionData(z);

  const getContributionConditions = (queryData: DataFromQuery) => {
    return contributionConditions({
      salary: Number(queryData.salary?.replaceAll(',', '')),
      frequency: Number(queryData.frequency) as SalaryFrequency,
      employeeContribution: Number(queryData.employeeContribution),
      employerContribution: Number(queryData.employerContribution),
    });
  };

  const [maxTaxRelief, setMaxTaxRelief] = useState<boolean>(false);
  const [jsEnabled, setJsEnabled] = useState<boolean>(false);

  useEffect(() => {
    setMaxTaxRelief(getContributionConditions(queryData).maxTaxRelief);
    setJsEnabled(true);
  }, [queryData]);

  const salary = calculateSalary(
    Number(String(queryData.salary).replace(/,/g, '')) *
      Number(queryData.frequency),
    queryData.contributionType,
  );
  const fields = step.fields as Fields[];

  const filterErrors = (errors: ErrorObject) => {
    return jsEnabled
      ? {
          contribution: errors.contribution,
        }
      : errors;
  };

  const salaryCondition = salaryConditions(
    Number(queryData.salary.replaceAll(',', '')),
    queryData.frequency as SalaryFrequency,
  );

  return (
    <div
      className="border-gray-200 border-t-[1px] py-2.5"
      data-testid="pension-contributions"
    >
      <div>
        <H4 className="inline-flex items-baseline text-blue-800">
          {step.title}
        </H4>
        {stepCompleted && (
          <>
            <PensionCalculatorContributionsSummary
              data={queryData}
              editPath={editPath}
              onEdit={onEdit}
            />
            {getContributionConditions(queryData).maxTaxRelief && (
              <TaxReliefLimitMessage />
            )}
          </>
        )}
      </div>

      {!stepCompleted && (
        <div className="flex-col mt-6">
          {queryData.contributionType === ContributionType.PART && (
            <>
              <Paragraph
                className="mb-1.5 text-gray-800"
                data-testid="contribution-message"
              >
                {contribution.summaryContributionTitle}{' '}
                {contribution.summaryContributionPart} £
                <NumericFormat
                  value={salary}
                  thousandSeparator=","
                  displayType="text"
                />{' '}
                {contribution.summaryContributionDuration}.
              </Paragraph>
              <ExpandableSection title={contribution.qualifiedEarningTitle}>
                <p>{contribution.qualifiedEarningText}</p>
              </ExpandableSection>

              <div className="bg-gray-200 p-4 mt-4 mb-2">
                <p className="text-gray-800">{contribution.legalMinimumPart}</p>
              </div>
              <ExpandableSection
                title={contribution.contributionInformationTitle}
              >
                <p>{contribution.contributionInformationTextPart}</p>
              </ExpandableSection>
            </>
          )}

          {queryData.contributionType === ContributionType.FULL && (
            <>
              <p className="text-gray-800" data-testid="contribution-message">
                {contribution.summaryContributionTitle}{' '}
                {contribution.summaryContributionFull} £
                <NumericFormat
                  value={salary}
                  thousandSeparator=","
                  displayType="text"
                />{' '}
                {contribution.summaryContributionDuration}.
              </p>
              <div className="bg-gray-200 p-4 my-4">
                {contribution.legalMinimumFull}
              </div>
              <ExpandableSection
                title={contribution.contributionInformationTitle}
              >
                <p className="text-gray-800">
                  {contribution.contributionInformationTextFull}
                </p>
              </ExpandableSection>
            </>
          )}

          {Object.keys(errors).length > 0 && (
            <PensionCalculatorErrors
              errors={filterErrors(errors)}
              fields={fields}
            />
          )}

          <div className="mb-4 max-w-sm">
            {fields
              .filter((f) => f.name !== 'contribution')
              .map((field, index) => (
                <div
                  key={field.name}
                  className="flex-col mt-4"
                  id={
                    errors[field.name]
                      ? `error-${errors[field.name].field}`
                      : ''
                  }
                >
                  <Errors errors={errors[field.name] ? ['error'] : []}>
                    <div
                      className={twMerge(
                        'bg-gray-100 pl-5 pb-5',
                        errors[field.name] && ['-ml-5'],
                        !errors[field.name] && ['p-4'],
                      )}
                    >
                      {errors[field.name] && (
                        <div className="text-red-700 py-2 pr-5 flex max-w-[90%]">
                          <span className="pr-2">{index + 1}.</span>
                          {field.errors[errors[field.name].type]}
                        </div>
                      )}
                      <div>
                        {field.information &&
                          salaryCondition.belowManualOptIn && (
                            <p className="mb-3">
                              {z({
                                en: 'At your salary level there is no legal minimum contribution but your workplace pension scheme may have a set minimum. Check with your employer.',
                                cy: 'Ar eich lefel cyflog, nid oes isafswm cyfreithiol o gyfraniad ond efallai y bydd eich cynllun pensiwn gweithlu wedi gosod isafswm. Holwch eich cyflogwr.',
                              })}
                            </p>
                          )}

                        <label
                          htmlFor={field.name}
                          className="mb-2.5 block font-bold"
                        >
                          {field.label}
                        </label>

                        <div className="flex items-baseline">
                          <PercentInput
                            name={field.name}
                            defaultValue={
                              queryData[field.name] ?? field.defaultValue
                            }
                            id={field.name}
                            onChange={(e) => {
                              const form = e.target.form
                                ?.elements as HTMLFormControlsCollection;
                              const submit = form.namedItem(
                                'submit',
                              ) as HTMLButtonElement;

                              const employerContribution = form.namedItem(
                                'employerContribution',
                              ) as HTMLInputElement;
                              const employeeContribution = form.namedItem(
                                'employeeContribution',
                              ) as HTMLInputElement;

                              const salaryCondition = contributionConditions({
                                salary: Number(
                                  queryData.salary?.replaceAll(',', ''),
                                ),
                                frequency: Number(
                                  queryData.frequency,
                                ) as SalaryFrequency,
                                employeeContribution: employeeContribution.value
                                  .length
                                  ? Number(employeeContribution.value)
                                  : null,
                                employerContribution: Number(
                                  employerContribution.value,
                                ),
                              });

                              setMaxTaxRelief(salaryCondition.maxTaxRelief);

                              const disableSubmit =
                                salaryCondition.requiredMinimum ||
                                salaryCondition.employerMinimum;

                              submit[
                                disableSubmit
                                  ? 'setAttribute'
                                  : 'removeAttribute'
                              ]('disabled', 'true');
                              onChange(e);
                            }}
                          />
                          <span className="ml-2 mt-auto text-gray-400">
                            {z({
                              en: 'of',
                              cy: 'o',
                            })}{' '}
                            £
                            <NumericFormat
                              value={salary}
                              thousandSeparator=","
                              displayType="text"
                            />{' '}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Errors>
                </div>
              ))}
          </div>
          {maxTaxRelief && <TaxReliefLimitMessage className="mb-0" />}
        </div>
      )}
    </div>
  );
};

export const PensionCalculatorContributionsSummary = ({
  data,
  editPath,
  onEdit,
}: {
  data: DataFromQuery;
  editPath: string;
  onEdit: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const { z } = useTranslation();
  return (
    <div className="md:ml-3 md:inline-flex items-baseline text-gray-400">
      <p className="mr-3 my-1">
        ({z({ en: 'You', cy: 'Chi' })}: {data.employeeContribution}%,{' '}
        {z({ en: 'Your employer', cy: 'Eich cyflogwr' })}:{' '}
        {data.employerContribution}%)
      </p>
      <Link
        onClick={onEdit}
        scroll={false}
        data-testid="edit-contributions"
        href={editPath}
        className="ml-auto visited:text-pink-600!important print:hidden"
      >
        {z({ en: 'Edit', cy: 'Golygu' })}
      </Link>
    </div>
  );
};

const TaxReliefLimitMessage = ({ className }: { className?: string }) => {
  const { z } = useTranslation();
  return (
    <ContributionMessage className={className} data-testid="tax-relief-message">
      <p>
        {z({
          en: `Tax relief is only applied to contributions of up to £40,000 per
          year or 100% of your earnings, whichever is lower.`,
          cy: `Rhoddir gostyngiad treth ar gyfraniadau hyd at £40,000 y flwyddyn yn unig, neu 100% o’ch enillion, pa bynnag un sydd leiaf..`,
        })}
      </p>
    </ContributionMessage>
  );
};
