import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { NumberInput } from '@maps-react/form/components/NumberInput';
import { Select } from 'components/Select';
import { Step, Fields } from 'data/workplace-pension-calculator';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { Errors, H2, Link, Paragraph } from '@maps-digital/shared/ui';
import {
  QuestionRadioButton,
  QuestionOption,
} from '@maps-react/form/components/QuestionRadioButton';
import { ErrorObject } from 'data/workplace-pension-calculator/pension-validation';
import { NumericFormat } from 'react-number-format';
import {
  AgeConditionsResults,
  ageConditions,
} from 'utils/PensionCalculator/ageConditions';
import { PensionInput } from 'data/workplace-pension-calculator/pension-data';
import { useTranslation } from '@maps-react/hooks/useTranslation';
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
import { addUnitToAriaLabel } from 'utils/addUnitToAriaLabel';

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
  const { z } = useTranslation();
  const fields = step.fields as Fields[];
  const [jsEnabled, setJSEnabled] = useState(false);
  const [salaryMessage, setSalaryMessage] =
    useState<SalaryConditionResult | null>(null);
  const [ageMessage, setAgeMessage] = useState<AgeConditionsResults | null>(
    null,
  );

  const contributionRef = useRef<HTMLInputElement>(null);

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
      contributionRef.current?.setAttribute('checked', 'true');
    }
  }, [queryData]);

  const setContributionType = (
    form: HTMLFormControlsCollection,
    salaryCondition: SalaryConditionResult,
  ) => {
    const contributionTypePart = form.namedItem(
      'contributionType-1',
    ) as HTMLInputElement;

    const contributionTypeFull = form.namedItem(
      'contributionType-0',
    ) as HTMLInputElement;

    contributionTypeFull.checked = salaryCondition.belowManualOptIn;
    contributionTypePart.checked = !salaryCondition.belowManualOptIn;
  };

  return (
    <div
      className="border-gray-200 border-t-[1px] py-2.5 lg:max-w-[640px]"
      data-testid="pension-details"
    >
      {Object.keys(errors).length > 0 && !jsEnabled && (
        <PensionCalculatorErrors errors={errors} fields={fields} />
      )}
      <div id="top">
        <H2
          className="inline-flex items-baseline text-2xl"
          color="text-blue-800"
        >
          {step.title}
        </H2>
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
          const isRadioField = field.name === PensionInput.CONTRIBUTION_TYPE;

          const content = (
            <>
              <Errors
                className={twMerge(hasError && ['pl-4'])}
                errors={hasError ? ['error'] : []}
              >
                {errors[field.name] && (
                  <div
                    className="text-red-700 py-2"
                    aria-describedby={field.name}
                  >
                    <span className="pr-2">{index + 1}.</span>
                    {field.errors[errors[field.name].type]}
                  </div>
                )}

                {isRadioField ? (
                  <legend className="mb-half block font-bold text-sm">
                    {field.label}
                  </legend>
                ) : (
                  <label
                    htmlFor={field.name}
                    className="mb-half block font-bold text-sm"
                  >
                    {field.label}
                  </label>
                )}

                {field.information && (
                  <Paragraph className="mt-2 text-sm">
                    {field.information}
                  </Paragraph>
                )}

                {field.showHide && <div>{field.showHide}</div>}

                {field.name === PensionInput.AGE && (
                  <NumberInput
                    aria-required={true}
                    className="border w-full min-w-fit rounded border-gray-600 py-2 mt-1 h-[49px] focus:outline-purple-700 focus:shadow-focus-outline max-w-[260px]"
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
                    aria-label={
                      field.label && addUnitToAriaLabel(field.label, 'years', z)
                    }
                  />
                )}

                {field.name === PensionInput.SALARY && (
                  <fieldset className="flex flex-wrap gap-2" role="group">
                    <div className="flex-grow-1 w-full max-w-[260px] min-w-fit">
                      <MoneyInput
                        aria-required={true}
                        id={PensionInput.SALARY}
                        name={PensionInput.SALARY}
                        className="border-gray-600 border-l-0"
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
                        aria-label={
                          field.label &&
                          addUnitToAriaLabel(field.label, 'pounds', z)
                        }
                      />
                    </div>

                    <Select
                      hideEmptyItem={true}
                      aria-required={true}
                      className="grow min-w-fit max-w-[260px]"
                      selectClassName="h-[49px]"
                      name={PensionInput.FREQUENCY}
                      id={PensionInput.FREQUENCY}
                      data-testid={PensionInput.FREQUENCY}
                      defaultValue={queryData?.frequency ?? '1'}
                      options={field.options as QuestionOption[]}
                      aria-label={z({
                        en: 'Frequency',
                        cy: 'Amlder',
                      })}
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
                  </fieldset>
                )}

                {field.name === PensionInput.CONTRIBUTION_TYPE && (
                  <div className="mt-4">
                    <PensionCalculatorMessage
                      type={field.name}
                      message={salaryMessage}
                    />
                    <QuestionRadioButton
                      className="flex flex-col-reverse"
                      ref={contributionRef}
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
                    />
                  </div>
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
            </>
          );

          return isRadioField ? (
            <fieldset
              key={field.name}
              className="flex-col mt-4 mb-6"
              id={hasError ? `error-${errors[field.name].field}` : ''}
            >
              {content}
            </fieldset>
          ) : (
            <div
              key={field.name}
              className="flex-col mt-4 mb-6"
              id={hasError ? `error-${errors[field.name].field}` : ''}
            >
              {content}
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
        <p className="mr-3 my-1 text-sm">
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
          className="ml-auto visited:text-pink-600 print:hidden text-sm"
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
          <div className="p-4">
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
  const classes = [
    'bg-blue-50 px-6 py-8 rounded-bl-[24px] my-4 print:p-0 text-[14px] leading-5 md:text-sm',
  ];
  return (
    <div className={twMerge(classes, className)} aria-live="polite">
      {children}
    </div>
  );
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
