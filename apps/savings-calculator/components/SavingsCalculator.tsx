import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useRouter } from 'next/router';

import {
  getDurationOptions,
  getInputs,
  getMonthOptions,
  getYearOptions,
} from 'data/form-content/questions/savings-calculator';
import { getText } from 'data/form-content/text/savings-calculator';
import { twMerge } from 'tailwind-merge';
import { FormContentAnlyticsData, type SavingsCalculatorType } from 'types';
import { interestRateWarning } from 'utils/savingsCalculatorResults';
import { getSixMonthsFromCurrentDate } from 'utils/savingsCalculatorValidationInputs';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { H2, Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { SocialShareTool } from '@maps-react/common/components/SocialShareTool';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { Container } from '@maps-react/core/components/Container';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { PercentInput } from '@maps-react/form/components/PercentInput';
import { Select } from '@maps-react/form/components/Select';
import { Question } from '@maps-react/form/types';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import useLanguage from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { addUnitToAriaLabel } from '@maps-react/pension-tools/utils/addUnitToAriaLabel';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { SavingsCalculatorResults } from './SavingsCalculatorResults';

export type ErrorField = {
  field: string;
  type: string;
};
export type ErrorObject = {
  [key: string]: ErrorField;
};
interface PensionPotCalculatorProps {
  lang?: string;
  isEmbed: boolean;
  errors: ErrorField[];
  queryData: DataFromQuery;
  calculatorType: SavingsCalculatorType;
  analyticsData?: FormContentAnlyticsData;
}
export const SavingsCalculator = ({
  isEmbed,
  errors,
  queryData = {},
  lang,
  calculatorType,
  analyticsData,
}: PensionPotCalculatorProps) => {
  const { z } = useTranslation();
  const { addEvent } = useAnalytics();
  const router = useRouter();
  const toolInit = useRef<boolean>(false);
  const toolStarted = useRef<boolean>(false);
  const toolCompleted = useRef<boolean>(false);

  const pageData = useMemo(() => {
    return {
      page: {
        pageName: analyticsData?.pageName,
        pageTitle: analyticsData?.pageTitle,
        lang: lang,
        categoryLevels: analyticsData?.categoryLevels,
        pageType: 'tool page',
      },
      tool: {
        toolName: analyticsData?.toolName,
        toolStep: '1',
        stepName: analyticsData?.stepNames as string,
      },
    };
  }, [analyticsData, lang]);

  const pageResults = useMemo(() => {
    return {
      ...pageData.page,
      pageName: `${pageData.page.pageName}--results`,
      tool: {
        ...pageData.tool,
        toolStep: '2',
        stepName: 'Your results',
      },
    };
  }, [pageData]);

  const fields = useMemo(
    () => getInputs(z, calculatorType),
    [z, calculatorType],
  );

  const { z: enTranslation } = useTranslation('en');

  const fieldsEn = useMemo(() => {
    return getInputs(enTranslation, calculatorType);
  }, [enTranslation, calculatorType]);

  const data = useMemo(() => getText(z, calculatorType), [z, calculatorType]);
  const refSubmit = useRef<HTMLInputElement>(null);
  const refError = useRef<HTMLInputElement>(null);

  const getErrors = useCallback(
    (
      errors: ErrorField[],
      fieldsOverride?: Question[],
    ): Record<string, string[]> => {
      const errorMap: Record<string, string[]> = {};

      errors.forEach((e) => {
        let field;
        if (fieldsOverride) {
          field = fieldsOverride.find((f) => f.type === e.field);
        } else {
          field = fields.find((f) => f.type === e.field);
        }

        const err =
          (field?.errors &&
            (field?.errors as Record<string, string>)[e.type]) ||
          null;

        if (field && err) {
          if (errorMap[e.field]) {
            errorMap[e.field].push('\n');
            errorMap[e.field].push(err);
          } else {
            errorMap[e.field] = [err];
          }
        }
      });

      return errorMap;
    },
    [fields],
  );

  const isQueryValid = useCallback(
    (queryData: DataFromQuery) => {
      const validQuery =
        queryData &&
        fields
          .filter((field) => field.type !== 'date')
          .map((field) => queryData[field.type])
          .every((v) => v !== undefined);

      return validQuery && Object.keys(getErrors(errors)).length === 0;
    },
    [fields, errors, getErrors],
  );

  const isValid = isQueryValid(queryData);

  const errorAnalytics = useCallback(() => {
    const err = getErrors(errors, fieldsEn);
    if (Object.keys(err).length) {
      toolCompleted.current = false;
      addEvent({
        event: 'errorMessage',
        eventInfo: {
          toolName: analyticsData?.toolName,
          toolStep: '1',
          stepName: analyticsData?.stepNames,
          errorDetails: Object.keys(err).map((key) => {
            const field = fieldsEn.find((f) => f.type === key);
            return {
              reactCompType: `${field?.group}`,
              reactCompName: `${field?.title}`,
              errorMessage: `${err[key]}`,
            };
          }),
        },
      } as AnalyticsData);
    }
  }, [addEvent, analyticsData, errors, fieldsEn, getErrors]);

  useEffect(() => {
    if (!toolInit.current) {
      if (isQueryValid(queryData)) {
        addEvent({
          page: {
            ...pageData.page,
            ...pageResults,
          },
          tool: pageResults.tool,
          event: 'pageLoadReact',
        });

        if (!toolCompleted.current) {
          addEvent({
            page: {
              ...pageData.page,
              ...pageResults,
            },
            tool: pageResults.tool,
            event: 'toolCompletion',
          });
        }

        toolStarted.current = true;
        toolCompleted.current = true;
      } else {
        addEvent({
          ...pageData,
          event: 'pageLoadReact',
        });
      }

      errorAnalytics();

      toolInit.current = true;
    }

    router.events.on('routeChangeComplete', errorAnalytics);

    return () => {
      router.events.off('routeChangeComplete', errorAnalytics);
    };
  }, [
    addEvent,
    isQueryValid,
    queryData,
    analyticsData,
    pageData,
    router,
    pageResults,
    errorAnalytics,
  ]);

  const analyticsTrack = () => {
    if (!toolStarted.current) {
      addEvent({
        ...pageData,
        event: 'toolStart',
      });
      toolStarted.current = true;
    }

    if (toolCompleted.current) {
      addEvent({
        page: {
          ...pageData.page,
          ...pageResults,
        },
        tool: pageResults.tool,
        event: 'toolRestart',
      });

      toolCompleted.current = false;
    }
  };

  return (
    <Container className="my-6">
      <div className="lg:max-w-[860px]">
        <div className="mb-6 lg:mb-8">
          <span className="block mb-6 text-xl font-bold text-blue-700 md:text-2xl">
            {data.title}
          </span>
          <BackLink href={`/${lang}`}>
            {z({
              en: 'Back',
              cy: 'Yn ôl',
            })}
          </BackLink>
          <ErrorSummary
            ref={refError}
            title={data.errorTitle}
            errors={getErrors(errors)}
            containerClassNames="mt-6"
          />
          <Heading className="mt-6 mb-6 md:mb-14 sm:leading-[54px]">
            {data.subTitle}
          </Heading>

          <div className="lg:flex lg:flex-row">
            <form
              onSubmit={() => {
                return false;
              }}
              className="basis-1/2"
              action={`/${lang}/${calculatorType}#results`}
              noValidate
            >
              <input
                type="hidden"
                name="isEmbed"
                value={isEmbed ? 'true' : 'false'}
              />
              <Inputs
                fields={fields}
                queryData={queryData}
                errors={errors}
                isValid={isValid}
                onChange={() => analyticsTrack()}
              />
              <div className="flex">
                <Button
                  ref={refSubmit}
                  className="mt-10 mb-14 md:mt-12 md:mb-16"
                  variant="primary"
                >
                  {isValid ? data.reSubmitButton : data.submitButton}
                </Button>
                {isValid && (
                  <Link
                    href={`https://www.moneyhelper.org.uk/${lang}/everyday-money/budgeting/budget-planner`}
                    asInlineText
                    asButtonVariant="secondary"
                    className="mt-10 ml-6 mb-14 md:mt-12 md:mb-16"
                  >
                    {z({
                      en: 'Start budgeting',
                      cy: 'Dechreuwch gyllidebu',
                    })}
                  </Link>
                )}
              </div>
            </form>
            {isValid && (
              <SavingsCalculatorResults
                queryData={queryData}
                calculatorType={calculatorType}
              />
            )}
          </div>
          {isValid && <ResultContent />}
        </div>
      </div>
    </Container>
  );
};

export const Inputs = ({
  fields,
  errors,
  queryData,
  isValid,
  onChange,
}: {
  fields: Question[];
  errors: ErrorField[];
  queryData: DataFromQuery;
  isValid: boolean;
  onChange?: () => void;
}) => {
  const { z } = useTranslation();
  const getErrorMessage = (field: Question, errors: ErrorField[]) => {
    return errors
      .filter((e) => e.field === field.type)
      .map((err) => (field?.errors as Record<string, string>)[err.type])
      .filter(Boolean);
  };

  const { month, year } = getSixMonthsFromCurrentDate();

  return (
    <>
      {fields?.map((field) => {
        const hasError = (field: Question) => {
          return getErrorMessage(field, errors).length > 0;
        };

        const groupInput = field.type === 'amount';
        const labelBaseClasses = 'text-2xl text-gray-800 inline-flex mb-2';
        return (
          <Errors
            errors={hasError(field) ? ['error'] : []}
            key={field.type}
            className={twMerge(hasError(field) ? 'pl-3' : '')}
          >
            <fieldset className="mb-6" role={groupInput ? 'group' : 'none'}>
              {!field.useLegend && (
                <label
                  htmlFor={field.type}
                  className={twMerge(
                    labelBaseClasses,
                    !!field.description && 'mb-0',
                  )}
                >
                  {field.title}
                </label>
              )}
              <legend
                className={twMerge(
                  labelBaseClasses,
                  !!field.description && 'mb-0',
                  !field.useLegend && 'sr-only',
                )}
              >
                {field.title}
              </legend>
              {hasError(field) && field?.errors && (
                <div className="mb-2 text-red-700">
                  {getErrorMessage(field, errors).map((e) => (
                    <span
                      className="block"
                      data-testid={`${field.type}-error`}
                      key={e.toString()}
                      id={`${field.type}-error`}
                    >
                      {e}
                    </span>
                  ))}
                </div>
              )}
              {field.type !== 'interest' && field.type === 'amount' && (
                <div className="md:flex md:flex-row">
                  <MoneyInput
                    aria-required={true}
                    id={`${field.type}`}
                    key={`${field.type}`}
                    name={`${field.type}`}
                    aria-describedby={
                      hasError(field) ? `${field.type}-error` : undefined
                    }
                    defaultValue={queryData[`${field.type}`]}
                    inputClassName="w-full md:max-w-max"
                    onChange={() => {
                      onChange && onChange();
                    }}
                    isAllowed={({ floatValue }) => {
                      return (
                        (floatValue ?? 0) >= 0 && (floatValue ?? 0) <= 999999999
                      );
                    }}
                    value={queryData[field.type]}
                    aria-label={addUnitToAriaLabel(field.title, 'pounds', z)}
                  />
                  <Select
                    id={`${field.type}Duration`}
                    name={`${field.type}Duration`}
                    aria-required={true}
                    hidePlaceholder={true}
                    onChange={() => {
                      onChange && onChange();
                    }}
                    aria-label={z({
                      en: 'Frequency',
                      cy: 'Amlder',
                    })}
                    defaultValue={queryData[`${field.type}Duration`] ?? '12'}
                    options={getDurationOptions(z)}
                    className="max-w-full md:max-w-max md:min-w-[195px] mt-6 md:ml-6 md:mt-0"
                    selectClassName="h-[49px]"
                  />
                </div>
              )}
              {field.type !== 'amount' && field.type === 'date' && (
                <div className="flex flex-col md:flex-row">
                  <div className="flex-col">
                    <label
                      htmlFor="durationMonth"
                      className="block mb-2 text-2xl"
                    >
                      {z({
                        en: 'Month',
                        cy: 'Mis',
                      })}
                    </label>
                    <Select
                      aria-required={true}
                      id={'durationMonth'}
                      name={'durationMonth'}
                      aria-label={z({
                        en: 'Month',
                        cy: 'Mis',
                      })}
                      defaultValue={queryData['durationMonth'] ?? month}
                      hidePlaceholder={true}
                      onChange={() => {
                        onChange && onChange();
                      }}
                      options={getMonthOptions(z)}
                      className="max-w-full md:min-w-[200px]"
                      selectClassName="h-[49px]"
                    />
                  </div>
                  <div className="max-w-full mt-4 md:ml-6 md:mt-0">
                    <label
                      htmlFor="durationYear"
                      className="block mb-2 text-2xl"
                    >
                      {z({
                        en: 'Year',
                        cy: 'Blwyddyn',
                      })}
                    </label>
                    <Select
                      aria-required={true}
                      id={'durationYear'}
                      name={'durationYear'}
                      hidePlaceholder={true}
                      defaultValue={queryData['durationYear'] ?? year}
                      options={getYearOptions()}
                      aria-label={z({
                        en: 'Year',
                        cy: 'Blwyddyn',
                      })}
                      onChange={() => {
                        onChange && onChange();
                      }}
                      className="max-w-full md:min-w-[200px]"
                      selectClassName="h-[49px]"
                    />
                  </div>
                </div>
              )}
              {field.type !== 'interest' &&
                field.type !== 'date' &&
                field.type !== 'amount' && (
                  <MoneyInput
                    data-testid={field.type}
                    aria-describedby={
                      hasError(field) ? `${field.type}-error` : undefined
                    }
                    aria-required={field.type === 'savingGoal' || undefined}
                    id={field.type}
                    key={field.type}
                    name={field.type}
                    onChange={() => {
                      onChange && onChange();
                    }}
                    inputClassName="w-full md:max-w-max"
                    isAllowed={({ floatValue }) => {
                      return (
                        (floatValue ?? 0) >= 0 && (floatValue ?? 0) <= 999999999
                      );
                    }}
                    value={queryData[field.type]}
                    aria-label={addUnitToAriaLabel(field.title, 'pounds', z)}
                  />
                )}
              {field.type === 'interest' && (
                <>
                  <PercentInput
                    decimalScale={2}
                    data-testid={field.type}
                    id={field.type}
                    key={field.type}
                    name={field.type}
                    onChange={() => {
                      onChange && onChange();
                    }}
                    inputClassName="w-full md:max-w-max"
                    isAllowed={({ floatValue }) => {
                      return (
                        (floatValue ?? 0) >= 0 && (floatValue ?? 0) <= 999999999
                      );
                    }}
                    inputMode="decimal"
                    value={queryData[field.type]}
                    aria-label={addUnitToAriaLabel(field.title, 'percent', z)}
                  />
                  {isValid && (
                    <InterestRateWarning interestRate={queryData.interest} />
                  )}
                </>
              )}
            </fieldset>
          </Errors>
        );
      })}
    </>
  );
};

const InterestRateWarning = ({ interestRate }: { interestRate: string }) => {
  const { z } = useTranslation();
  const hasInterestRateWarning = interestRateWarning(Number(interestRate));
  return (
    <>
      {hasInterestRateWarning.annualInterestRateHigh && (
        <p className="mt-4">
          {z({
            en: (
              <>
                The interest rate you added looks higher than we
                {"'"}d expect, did you mean to enter{' '}
                <span className="font-bold">{interestRate}%</span>?{' '}
              </>
            ),
            cy: (
              <>
                Mae’r gyfradd llog rydych wedi’i hychwanegu’n edrych yn uwch nag
                y byddem yn ei disgwyl, a oeddech yn bwriadu nodi{' '}
                <span className="font-bold">{interestRate}%</span>?{' '}
              </>
            ),
          })}
        </p>
      )}
      {hasInterestRateWarning.annualInterestRateLow && (
        <p className="mt-4">
          {z({
            en: (
              <>
                The interest rate you added looks lower than you could be
                getting. Shop around for{' '}
                <Link
                  className="inline"
                  target="_blank"
                  asInlineText
                  href={
                    'https://www.moneyhelper.org.uk/en/savings/how-to-save/cash-savings-at-a-glance'
                  }
                >
                  the best savings account for you.
                </Link>
              </>
            ),
            cy: (
              <>
                Mae’r gyfradd llog rydych wedi’i hychwanegu’n edrych yn is nag y
                gallech ei chael. Chwiliwch am y{' '}
                <Link
                  target="_blank"
                  asInlineText
                  href={
                    'https://www.moneyhelper.org.uk/en/savings/how-to-save/cash-savings-at-a-glance'
                  }
                >
                  cyfrif cynilo gorau ar eich cyfer chi.
                </Link>
              </>
            ),
          })}
        </p>
      )}
    </>
  );
};

const ResultContent = () => {
  const { z } = useTranslation();
  const lang = useLanguage();
  const canonicalUrl = `https://www.moneyhelper.org.uk/${lang}/savings/how-to-save/savings-calculator`;

  return (
    <div className="lg:mt-8">
      <p className="mb-8 text-sm">
        {z({
          en: (
            <>
              This tool gives you an{' '}
              <span className="font-bold">indication</span> of how long it will
              take to reach your goal, or how much you need to regularly save to
              have your savings by a specific date.{' '}
              <span className="font-bold">
                Results are an estimate and should only be used as such.
              </span>
            </>
          ),
          cy: (
            <>
              Mae’r offeryn hwn yn rhoi{' '}
              <span className="font-bold">arwydd</span> ichi o faint o amser y
              bydd yn ei gymryd i gyrraedd eich nod, neu faint fydd angen ichi
              gynilo’n rheolaidd i gael eich cynilion erbyn dyddiad penodol{' '}
              <span className="font-bold">
                Mae’r canlyniadau’n amcangyfrif a dylid eu defnyddio fel hynny’n
                unig.
              </span>
            </>
          ),
        })}
      </p>
      <H2
        className="text-[38px] leading-[43px]"
        data-testid="next-steps-heading"
      >
        {z({
          en: 'Next steps',
          cy: 'Camau nesaf',
        })}
      </H2>
      <ul className="pl-6 mt-6 list-disc list-outside">
        <li className="mb-2">
          {z({
            en: (
              <>
                Use our{' '}
                <Link
                  className="inline font-bold visited:text-magenta-500"
                  target="_blank"
                  asInlineText
                  href={
                    'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner'
                  }
                >
                  Budget planner
                </Link>{' '}
                to work out how much you can afford to save.
              </>
            ),
            cy: (
              <>
                Defnyddiwch ein{' '}
                <Link
                  className="inline font-bold visited:text-magenta-500"
                  target="_blank"
                  asInlineText
                  href={
                    'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner'
                  }
                >
                  Cynllunydd cyllideb
                </Link>{' '}
                i gyfrifo faint gallwch chi fforddio i’w gynilo.
              </>
            ),
          })}
        </li>
        <li className="mb-2">
          {z({
            en: (
              <>
                Compare the different types of saving and investment options
                with our{' '}
                <Link
                  className="inline font-bold visited:text-magenta-500"
                  target="_blank"
                  asInlineText
                  href={
                    'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/how-to-save-money-on-household-bills'
                  }
                >
                  Savings guides
                </Link>
                .
              </>
            ),
            cy: (
              <>
                Cymharwch y gwahanol fathau o opsiynau gynilion a buddsoddiadau
                gyda’n{' '}
                <Link
                  className="inline font-bold visited:text-magenta-500"
                  target="_blank"
                  asInlineText
                  href={
                    'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/how-to-save-money-on-household-bills'
                  }
                >
                  Canllawiau cynilo
                </Link>
                .
              </>
            ),
          })}
        </li>
        <li>
          {z({
            en: (
              <>
                Learn{' '}
                <Link
                  className="inline font-bold visited:text-magenta-500"
                  target="_blank"
                  asInlineText
                  href={
                    'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/beginners-guide-to-managing-your-money'
                  }
                >
                  how to set a savings goal
                </Link>
                .
              </>
            ),
            cy: (
              <>
                Dysgwch{' '}
                <Link
                  className="inline font-bold visited:text-magenta-500"
                  target="_blank"
                  asInlineText
                  href={
                    'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/beginners-guide-to-managing-your-money'
                  }
                >
                  sut i osod nod cynilo
                </Link>
                .
              </>
            ),
          })}
        </li>
      </ul>
      <ToolFeedback />
      <div className="flex flex-col justify-between py-6 mt-8 border-t print:hidden t-social-sharing sm:flex-row border-slate-400">
        <SocialShareTool
          url={canonicalUrl}
          title={z({
            en: 'Share this tool',
            cy: 'Rhannwch yr offeryn hwn',
          })}
          subject={z({
            en: 'Savings calculator - Find out how fast you can reach your savings goal',
            cy: 'Cyfrifiannell cynilion – Darganfyddwch pa mor gyflym y gallwch gyrraedd eich nod cynilo',
          })}
          withDivider={true}
          xTitle={z({
            en: 'Savings calculator - Find out how fast you can reach your savings goal',
            cy: 'Cyfrifiannell cynilion – Darganfyddwch pa mor gyflym y gallwch gyrraedd eich nod cynilo',
          })}
        />
      </div>
    </div>
  );
};
