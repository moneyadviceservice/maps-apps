import { MoneyInput } from 'components/MoneyInput';
import { NumberInput } from 'components/NumberInput';
import { Select } from 'components/Select';
import { Step, Fields } from 'data/workplace-pension-calculator';
import { useEffect, useMemo, useState } from 'react';
import { DataFromQuery } from 'utils/pageFilter';

import {
  Errors,
  H4,
  Link,
  Paragraph,
  QuestionOption,
  QuestionRadioButton,
} from '@maps-digital/shared/ui';
import { ErrorObject } from 'data/workplace-pension-calculator/pension-validation';
import { NumericFormat } from 'react-number-format';
import {
  AgeConditionsResults,
  ageConditions,
} from 'utils/PensionCalculator/ageConditions';
import { PensionInput } from 'data/workplace-pension-calculator/pension-data';
import { useTranslation } from '@maps-digital/shared/hooks';
import {
  SalaryConditionResult,
  SalaryFrequency,
  salaryConditions,
} from 'utils/PensionCalculator/salaryConditions';
import { twMerge } from 'tailwind-merge';
import {
  contributionMessages,
  contributionData,
} from 'data/workplace-pension-calculator/pension-contributions';

export const PensionCalculatorDetails = ({
  stepCompleted,
  queryData,
  step,
  editPath,
  errors,
  onEdit,
}: {
  stepCompleted: boolean;
  queryData: DataFromQuery;
  step: Step;
  editPath: string;
  errors: ErrorObject;
  onEdit: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const fields = step.fields as Fields[];
  const [jsEnabled, setJSEnabled] = useState(false);
  const [salaryMessage, setSalaryMessage] =
    useState<SalaryConditionResult | null>(null);
  const [ageMessage, setAgeMessage] = useState<AgeConditionsResults | null>(
    null,
  );

  useEffect(() => {
    setJSEnabled(true);
    if (queryData.age && queryData.salary) {
      const ageCondition = ageConditions(Number(queryData.age));
      const salaryCondition = salaryConditions(
        Number(queryData.salary.replaceAll(',', '')),
        Number(queryData.frequency) as SalaryFrequency,
      );
      setAgeMessage(ageCondition);
      setSalaryMessage(salaryCondition);
    } else {
      setAgeMessage(null);
      setSalaryMessage(null);
    }

    if (queryData.reset === 'true') {
      (
        document.getElementById('contributionType-0') as HTMLInputElement
      ).checked = true;
    }
  }, [queryData]);

  const setContributionType = (
    form: HTMLFormControlsCollection,
    salaryCondition: SalaryConditionResult,
  ) => {
    const contributionTypePart = form.namedItem(
      'contributionType-0',
    ) as HTMLInputElement;

    const contributionTypeFull = form.namedItem(
      'contributionType-1',
    ) as HTMLInputElement;

    contributionTypeFull.checked = salaryCondition.belowManualOptIn;
    contributionTypePart.checked = !salaryCondition.belowManualOptIn;
  };

  return (
    <div
      className="border-gray-200 border-t-[1px] py-2.5"
      data-testid="pension-details"
    >
      {Object.keys(errors).length > 0 && !jsEnabled && (
        <PensionCalculatorErrors errors={errors} fields={fields} />
      )}

      <div id="top">
        <H4 className="inline-flex items-baseline text-blue-800">
          {step.title}
        </H4>
        {stepCompleted && (
          <PensionCalculatorDetailsSummary
            editPath={editPath}
            queryData={queryData}
            onEdit={onEdit}
          >
            <PensionCalculatorMessage
              type={PensionInput.SALARY}
              stepCompleted={true}
              message={salaryConditions(
                Number(queryData.salary.replaceAll(',', '')),
                queryData.frequency as SalaryFrequency,
              )}
            />
          </PensionCalculatorDetailsSummary>
        )}
      </div>

      {!stepCompleted &&
        fields.map((field, index) => {
          const hasError = errors[field.name];
          return (
            <div
              key={field.name}
              className="flex-col mt-4 mb-6"
              id={hasError ? `error-${errors[field.name].field}` : ''}
            >
              <Errors errors={hasError ? ['error'] : []}>
                {errors[field.name] && (
                  <div className="text-red-700 py-2">
                    <span className="pr-2">{index + 1}.</span>
                    {field.errors[errors[field.name].type]}
                  </div>
                )}

                <label htmlFor={field.name} className="mb-half block font-bold">
                  {field.label}
                </label>

                {field.information && (
                  <Paragraph className="mt-2">{field.information}</Paragraph>
                )}

                {field.showHide && <div>{field.showHide}</div>}

                {field.name === PensionInput.AGE && (
                  <NumberInput
                    className="border rounded border-gray-600 py-2 mt-1 h-auto focus:outline-purple-700 focus:shadow-focus-outline max-w-[200px]"
                    id={field.name}
                    name={field.name}
                    defaultValue={queryData[field.name]}
                    onChange={(e) => {
                      delete errors[field.name];
                      const ageCondition = ageConditions(
                        Number(e.target.value),
                      );
                      setAgeMessage(ageCondition);

                      const form = e.target.form
                        ?.elements as HTMLFormControlsCollection;
                      const submit = form.namedItem(
                        'submit',
                      ) as HTMLButtonElement;

                      const disableSubmit =
                        ageCondition.minRequired || ageCondition.maxRequired;

                      submit[
                        disableSubmit ? 'setAttribute' : 'removeAttribute'
                      ]('disabled', 'true');
                    }}
                  />
                )}

                {field.name === PensionInput.SALARY && (
                  <div className="flex">
                    <MoneyInput
                      id={PensionInput.SALARY}
                      name={PensionInput.SALARY}
                      className="mr-2 border-gray-600 border-l-0"
                      defaultValue={queryData?.salary}
                      onChange={(e) => {
                        delete errors[field.name];
                        const form = e.target.form
                          ?.elements as HTMLFormControlsCollection;
                        const value = e.target.value;
                        const frequency = form.namedItem(
                          PensionInput.FREQUENCY,
                        ) as HTMLInputElement;

                        const salaryCondition = salaryConditions(
                          Number(value.replaceAll(',', '')),
                          Number(frequency.value) as SalaryFrequency,
                        );

                        setSalaryMessage(salaryCondition);
                        setContributionType(form, salaryCondition);
                      }}
                    />
                    <Select
                      hideEmptyItem={true}
                      name={PensionInput.FREQUENCY}
                      id={PensionInput.FREQUENCY}
                      data-testid={PensionInput.FREQUENCY}
                      defaultValue={queryData?.frequency ?? '1'}
                      options={field.options as QuestionOption[]}
                      onChange={(e) => {
                        const form = e.target.form
                          ?.elements as HTMLFormControlsCollection;
                        const value = e.target.value;
                        const salary = form.namedItem(
                          PensionInput.SALARY,
                        ) as HTMLInputElement;

                        const salaryCondition = salaryConditions(
                          Number(salary.value.replaceAll(',', '')),
                          Number(value) as SalaryFrequency,
                        );

                        setSalaryMessage(salaryCondition);
                        setContributionType(form, salaryCondition);
                      }}
                    />
                  </div>
                )}

                {field.name === PensionInput.CONTRIBUTION_TYPE && (
                  <>
                    <PensionCalculatorMessage
                      type={field.name}
                      message={salaryMessage}
                    />
                    <QuestionRadioButton
                      name={field.name}
                      defaultChecked={
                        salaryMessage?.belowManualOptIn
                          ? 'full'
                          : queryData.contributionType ?? field.defaultValue
                      }
                      options={
                        field.options?.map((f) => {
                          return {
                            ...f,
                            disabled:
                              salaryMessage?.belowManualOptIn &&
                              f.value === 'part',
                          };
                        }) as QuestionOption[]
                      }
                    ></QuestionRadioButton>
                  </>
                )}
              </Errors>

              {field.name === PensionInput.SALARY && (
                <PensionCalculatorMessage
                  type={PensionInput.SALARY}
                  message={salaryMessage}
                />
              )}
              {field.name === PensionInput.AGE && (
                <PensionCalculatorMessage
                  type={PensionInput.AGE}
                  message={ageMessage}
                />
              )}
            </div>
          );
        })}
    </div>
  );
};

export const PensionCalculatorDetailsSummary = ({
  queryData,
  editPath,
  children,
  onEdit,
}: {
  queryData: DataFromQuery;
  editPath: string;
  children?: React.ReactNode;
  onEdit: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const { z } = useTranslation();
  const contribution = contributionData(z);
  const contributionType =
    contribution.contributionType[queryData.contributionType];
  const frequency = contribution.frequency[queryData.frequency];

  return (
    <>
      <div className="md:ml-3 md:inline-flex items-baseline text-gray-400">
        <p className="mr-3 my-1">
          ({queryData.age} {z({ en: 'years', cy: 'blynyddoedd' })}, £
          <NumericFormat
            value={queryData.salary}
            thousandSeparator=","
            displayType="text"
          />{' '}
          {z({ en: 'per', cy: 'fesul' })} {frequency}, {contributionType})
        </p>
        <Link
          scroll={false}
          data-testid="edit-details"
          href={editPath}
          onClick={onEdit}
          className="ml-auto visited:text-pink-600 print:hidden"
        >
          {z({ en: 'Edit', cy: 'Golygu' })}
        </Link>
      </div>
      {children}
    </>
  );
};

export const PensionCalculatorErrors = ({
  errors,
  fields,
}: {
  errors: ErrorObject;
  fields: Fields[];
}) => {
  const { z } = useTranslation();
  const hasFieldErrors = fields
    .reduce((acc, field) => {
      acc.push(!!errors[field.name]);
      return acc;
    }, [] as boolean[])
    .some((error) => error);

  return (
    hasFieldErrors && (
      <div className="text-red-700 bg-[#ffeef0] my-4">
        <Errors errors={['error']}>
          <div className="p-4 pl-0">
            <p className="mb-2 font-bold">
              {z({
                en: 'Please double-check for the following errors:',
                cy: 'Gwiriwch ddwywaith am y gwallau canlynol:',
              })}
            </p>
            {Object.keys(errors).map((key, index) => {
              const field = fields.find(
                (field) => field?.name === key,
              ) as Fields;
              return (
                <div key={key} className="mb-2">
                  {index + 1}. {field?.errors[errors[key]?.type]}
                </div>
              );
            })}
          </div>
        </Errors>
      </div>
    )
  );
};

export const ContributionMessage = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const classes = ['bg-gray-200 p-4 my-4 print:p-0 text-xs sm:text-sm'];
  return <div className={twMerge(classes, className)}>{children}</div>;
};

export const PensionCalculatorMessage = ({
  message,
  type,
  stepCompleted = false,
}: {
  message: AgeConditionsResults | SalaryConditionResult | null;
  type: string;
  stepCompleted?: boolean;
}) => {
  const { z } = useTranslation();
  const messages = useMemo(() => contributionMessages(z), [z]);

  return (
    <div>
      {(message as SalaryConditionResult)?.belowManualOptIn &&
        !stepCompleted &&
        type === PensionInput.SALARY && (
          <ContributionMessage>
            {messages[type]?.belowManualOptIn}
          </ContributionMessage>
        )}
      {(message as SalaryConditionResult)?.belowManualOptIn &&
        (type === PensionInput.CONTRIBUTION_TYPE || stepCompleted) && (
          <ContributionMessage>
            {messages[type]?.belowManualOptIn}
          </ContributionMessage>
        )}
      {(message as SalaryConditionResult)?.manualOptInRequired &&
        (type === PensionInput.SALARY || stepCompleted) && (
          <ContributionMessage>
            {messages[type]?.manualOptInRequired}
          </ContributionMessage>
        )}
      {(message as SalaryConditionResult)?.nearPensionThreshold &&
        (type === PensionInput.SALARY || stepCompleted) && (
          <ContributionMessage className="bg-yellow-300">
            {messages[type]?.nearPensionThreshold}
          </ContributionMessage>
        )}
      {(message as SalaryConditionResult)?.nearAutoEnrollThreshold &&
        (type === PensionInput.SALARY || stepCompleted) && (
          <ContributionMessage className="bg-yellow-300">
            {messages[type]?.nearAutoEnrollThreshold}
          </ContributionMessage>
        )}
      {(message as AgeConditionsResults)?.minRequired && (
        <ContributionMessage>{messages[type]?.minRequired}</ContributionMessage>
      )}
      {(message as AgeConditionsResults)?.maxRequired && (
        <ContributionMessage>{messages[type]?.maxRequired}</ContributionMessage>
      )}
      {(message as AgeConditionsResults)?.optIn && (
        <ContributionMessage>{messages[type]?.optIn}</ContributionMessage>
      )}
    </div>
  );
};
