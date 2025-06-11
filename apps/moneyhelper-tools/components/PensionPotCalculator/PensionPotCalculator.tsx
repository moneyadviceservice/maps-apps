import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import { getText } from 'data/form-content/text/pension-pot-calculator';
import { twMerge } from 'tailwind-merge';
import { DataPath, FormContentAnlyticsData } from 'types';
import { getQuestions } from 'utils/getQuestions';
import { pensionPotValidateInputs } from 'utils/PensionPotCalculator/pensionPotValidationInputs';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { H1, H2 } from '@maps-react/common/components/Heading';
import { Container } from '@maps-react/core/components/Container';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { NumberInput } from '@maps-react/form/components/NumberInput';
import { Question } from '@maps-react/form/types';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { addUnitToAriaLabel } from '@maps-react/pension-tools/utils/addUnitToAriaLabel';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { PensionPotAdjustableIcomeResults } from './PensionPotAdjustableIcomeResults';
import { PensionPotCashInChunksResults } from './PensionPotCashInChunksResults';
import { PensionPotGaranteedIncomeResults } from './PensionPotGaranteedIncomeResults';
import { PensionPotLeavePotUntouchedResults } from './PensionPotLeavePotUntouchedResults';
import { PensionPotTakeWholePotResults } from './PensionPotTakeWholePotResults';

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
  errors: ErrorObject;
  queryData: DataFromQuery;
  dataPath: DataPath;
  action: string;
  analyticsData: FormContentAnlyticsData;
}
export const PensionPotCalculator = ({
  isEmbed,
  errors,
  queryData = {},
  dataPath,
  action,
  lang,
  analyticsData,
}: PensionPotCalculatorProps) => {
  const { z } = useTranslation();
  const { addEvent } = useAnalytics();
  const fields = useMemo(() => getQuestions(z, dataPath), [z, dataPath]);

  const { z: enTranslation } = useTranslation('en');

  const fieldsEn = useMemo(() => {
    return getQuestions(enTranslation, dataPath);
  }, [enTranslation, dataPath]);

  const data = useMemo(() => getText(z, dataPath), [z, dataPath]);

  const router = useRouter();
  const [clientErrors, setClientErrors] = useState<ErrorObject>({});
  const inputInteracted = useRef<string[]>([]);
  const toolInit = useRef<boolean>(false);
  const toolStarted = useRef<boolean>(false);
  const toolCompleted = useRef<boolean>(false);
  const currentInput = useRef<string>('');
  const refSubmit = useRef<HTMLInputElement>(null);
  const refError = useRef<HTMLInputElement>(null);
  const updateInputs = useMemo(() => ['updateChunk', 'updateMonth'], []);

  const pageData = useMemo(() => {
    return {
      page: {
        pageName: analyticsData?.pageName,
        pageTitle: analyticsData?.pageTitle,
        lang: lang,
        categoryLevels: analyticsData.categoryLevels,
        pageType: 'tool page',
      },
      tool: {
        toolName: analyticsData?.toolName,
        toolStep: '1',
        stepName: analyticsData.stepNames as string,
      },
    };
  }, [analyticsData, lang]);

  const pageResults = useMemo(() => {
    return {
      ...pageData.page,
      pageName: pageData.page.pageName.includes('--')
        ? pageData.page.pageName.replace(/--\w+/, '--results')
        : `${pageData.page.pageName}--results`,
      tool: {
        ...pageData.tool,
        toolStep: '2',
        stepName: 'Your results',
      },
    };
  }, [pageData]);

  const submitTracking = useCallback(() => {
    if (!toolCompleted.current) {
      addEvent({
        page: {
          ...pageData.page,
          ...pageResults,
        },
        tool: pageResults.tool,
        event: 'pageLoadReact',
      });
    }

    addEvent({
      page: {
        ...pageData.page,
        ...pageResults,
      },
      tool: pageResults.tool,
      event: 'toolCompletion',
    });

    toolCompleted.current = true;
    currentInput.current = '';
  }, [addEvent, pageData, toolCompleted, pageResults]);

  const checkUpdateValue = (
    field: Question,
    acc: Record<string, string>,
    form: HTMLFormElement,
  ) => {
    const name = field.type.split(/(?=[A-Z])/)[1].toLowerCase();
    const value = (form.elements.namedItem(name) as HTMLInputElement)?.value;
    if (value?.length) {
      acc[field.type] = value;
    }
    return acc;
  };
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;

      const inputData = fields.reduce((acc, field) => {
        acc[field.type] = (
          form.elements.namedItem(field.type) as HTMLInputElement
        )?.value;
        if (updateInputs.includes(field.type)) {
          return checkUpdateValue(field, acc, form);
        }
        return acc;
      }, {} as Record<string, string>);

      if (!inputData.month && inputData?.month?.length === 0) {
        inputData.month = '0';
        inputData.updateMonth = '0';
      }

      const errors = pensionPotValidateInputs({ inputs: inputData, dataPath });
      const getQuery = () => {
        const q = {
          ...router.query,
          ...inputData,
        };
        if (dataPath === DataPath.AjustableIncomeEstimator) {
          delete q['updateMonth'];
        }
        if (dataPath === DataPath.CashInChunksCalculator) {
          delete q['updateChunk'];
        }

        return q;
      };
      router.push(
        {
          pathname: router.route,
          query: getQuery(),
          hash: 'results',
        },
        undefined,
        { scroll: false },
      );

      if (Object.keys(errors).length) {
        e.preventDefault();
        setClientErrors(errors);
        refError.current?.scrollIntoView();
        return;
      }
      submitTracking();
      refSubmit.current?.blur();
      setClientErrors({});
    },
    [router, fields, updateInputs, dataPath, submitTracking],
  );

  const formatErrors = useCallback(
    (errors: ErrorObject, fieldsOveride?: Question[]) => {
      return Object.keys(errors).reduce((acc, key) => {
        const field = errors[key];
        let f;
        if (fieldsOveride) {
          f = fieldsOveride.find((f) => f.type === field.field);
        } else {
          f = fields.find((f) => f.type === field.field);
        }
        const error = (f?.errors as Record<string, string>)[field.type];
        if (error && f) {
          acc.push({ field: f, type: error });
        }
        return acc;
      }, [] as { field: Question; type: string }[]);
    },
    [fields],
  );

  const getErrors = useCallback(
    (errors: ErrorObject) => {
      const err = formatErrors(errors);
      return err.reduce((acc, e) => {
        const field = e.field;
        const error = e.type;
        acc[field.type] = [`${field.title}`, ' - ', `${error}`];
        return acc;
      }, {} as Record<string, string[]>);
    },
    [formatErrors],
  );

  const hasError =
    Object.keys(clientErrors).length || Object.keys(errors).length;
  const isQueryValid = useCallback(
    (queryData: DataFromQuery) => {
      const validQuery =
        queryData &&
        Object.keys(fields.filter((f) => !updateInputs.includes(f.type)))
          .map((field) => queryData[fields[Number(field)].type])
          .every((v) => v !== undefined);
      const err = getErrors(
        Object.keys(clientErrors).length ? clientErrors : errors,
      );
      return validQuery && Object.keys(err).length === 0;
    },
    [fields, errors, clientErrors, getErrors, updateInputs],
  );

  const errorAnalytics = useCallback(() => {
    const err = formatErrors(errors, fieldsEn);

    if (err.length) {
      toolCompleted.current = false;
      addEvent({
        event: 'errorMessage',
        eventInfo: {
          toolName: analyticsData?.toolName,
          toolStep: '1',
          stepName: analyticsData.stepNames,
          errorDetails: err.map((e) => {
            return {
              reactCompType: `${e.field.group}`,
              reactCompName: `${e.field.title}`,
              errorMessage: `${e.type}`,
            };
          }),
        },
      } as AnalyticsData);
    }
  }, [addEvent, analyticsData, errors, fieldsEn, formatErrors]);

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
    lang,
    queryData,
    analyticsData,
    errors,
    formatErrors,
    pageData,
    fieldsEn,
    router,
    toolCompleted,
    errorAnalytics,
    pageResults,
  ]);

  const analyticsTrack = (
    e: ChangeEvent<HTMLInputElement>,
    field: Question,
    formStart = false,
  ) => {
    if (!toolStarted.current) {
      addEvent({
        ...pageData,
        event: 'toolStart',
      });
      toolStarted.current = true;
    }

    if (toolCompleted.current && formStart) {
      addEvent({
        page: {
          ...pageData.page,
          ...pageResults,
        },
        tool: pageResults.tool,
        event: 'toolRestart',
      });

      toolCompleted.current = false;
      inputInteracted.current = [];
    }

    if (e.target.name !== currentInput.current) {
      if (!inputInteracted.current.find((i) => i === e.target.name)) {
        inputInteracted.current.push(e.target.name);

        addEvent({
          event: 'toolInteraction',
          eventInfo: {
            toolName: analyticsData?.toolName,
            toolStep: isQueryValid(queryData) ? '2' : '1',
            stepName: isQueryValid(queryData)
              ? 'Your results'
              : analyticsData.stepNames,
            reactCompType: field.group,
            reactCompName: fieldsEn.find((f) => f.type === field.type)?.title,
          },
        } as AnalyticsData);
      }

      currentInput.current = e.target.name;
    }
  };

  return (
    <Container
      className={twMerge('lg:max-w-[960px]', isEmbed ? ['m-0', 'p-0'] : '')}
    >
      <div className="bg-blue-100 p-5 md:p-10 mb-8 rounded-bl-[24px]">
        {isEmbed ? (
          <H2 className="mb-6 text-blue-800 md:mb-8">{data.title}</H2>
        ) : (
          <H1 className="mb-6 text-blue-800 md:mb-8">{data.title}</H1>
        )}
        <ErrorSummary
          ref={refError}
          classNames={hasError ? 'mb-6' : ''}
          title={data.errorTitle}
          errors={getErrors(
            Object.keys(clientErrors).length ? clientErrors : errors,
          )}
        />
        <form action={action} noValidate onSubmit={(e) => handleSubmit(e)}>
          <input
            type="hidden"
            name="isEmbed"
            value={isEmbed ? 'true' : 'false'}
          />
          <Inputs
            fields={fields.filter((f) => !updateInputs.includes(f.type))}
            queryData={queryData}
            onChange={(e, field) => {
              analyticsTrack(e, field, true);
            }}
            errors={Object.keys(clientErrors).length ? clientErrors : errors}
          />
          <Button
            ref={refSubmit}
            className="mt-10 text-base leading-normal mb-14 md:mt-12 md:mb-16 md:leading-6"
            variant="primary"
            name="submit"
            value="true"
            id="submit"
          >
            {isQueryValid(queryData)
              ? data.submittedButtonText
              : data.buttonText}
          </Button>
          <div className="mb-8 text-base">{data.calloutMessage}</div>
          {isQueryValid(queryData) &&
            dataPath === DataPath.CashInChunksCalculator && (
              <PensionPotCashInChunksResults
                queryData={queryData}
                data={data}
                fields={fields}
                onChange={(e, field) => analyticsTrack(e, field)}
              />
            )}
          {isQueryValid(queryData) && dataPath === DataPath.TakeWholePot && (
            <PensionPotTakeWholePotResults queryData={queryData} data={data} />
          )}
          {isQueryValid(queryData) &&
            dataPath === DataPath.GuaranteedIncomeEstimator && (
              <PensionPotGaranteedIncomeResults
                queryData={queryData}
                data={data}
              />
            )}
          {isQueryValid(queryData) &&
            dataPath === DataPath.LeavePotUntouched && (
              <PensionPotLeavePotUntouchedResults
                queryData={queryData}
                fields={fields}
                data={data}
                onChange={(e, field) => analyticsTrack(e, field)}
              />
            )}
          {isQueryValid(queryData) &&
            dataPath === DataPath.AjustableIncomeEstimator && (
              <PensionPotAdjustableIcomeResults
                queryData={queryData}
                fields={fields}
                data={data}
                onChange={(e, field) => analyticsTrack(e, field)}
              />
            )}
        </form>
      </div>
    </Container>
  );
};
export const Inputs = ({
  fields,
  errors,
  queryData,
  onChange,
}: {
  fields: Question[];
  errors: ErrorObject;
  queryData: DataFromQuery;
  onChange?: (e: ChangeEvent<HTMLInputElement>, field: Question) => void;
}) => {
  const { z } = useTranslation();

  const getErrorMessage = (field: Question, errors: ErrorObject) => {
    const HTMLvariant = (field.errors as Record<string, ReactNode>)[
      `${errors[field.type].type}HTML`
    ];
    if (HTMLvariant) {
      return HTMLvariant;
    }
    return (field.errors as Record<string, string>)[errors[field.type].type];
  };

  return (
    <>
      {fields?.map((field) => {
        const hasError = (field?.errors as Record<string, string>)[
          errors[field.type]?.type
        ];
        const hasRequired =
          (field?.errors as Record<string, string>)['required'] !== undefined;

        return (
          <Errors
            errors={hasError ? ['error'] : []}
            key={field.type}
            className={twMerge(hasError ? 'pl-4' : '')}
          >
            <fieldset className="mb-4">
              <label
                htmlFor={field.type}
                className={twMerge(
                  'text-2xl font-medium text-gray-800 inline-flex mb-2',
                  !!field.description && 'mb-0',
                )}
              >
                {field.title}
              </label>
              {field.description && <>{field.description}</>}
              {hasError && field?.errors && (
                <div
                  className="mb-2 text-red-700"
                  aria-describedby={field.type}
                >
                  {getErrorMessage(field, errors)}
                </div>
              )}
              {field.type === 'age' && (
                <div className="flex">
                  <NumberInput
                    data-testid={field.type}
                    aria-required={hasRequired || undefined}
                    id={field.type}
                    key={field.type}
                    name={field.type}
                    className="border-gray-600 border-r-0 h-[49px] ml-0 max-w-[307px]"
                    value={queryData[field.type]}
                    onChange={(e) => {
                      onChange && onChange(e, field);
                    }}
                    aria-label={addUnitToAriaLabel(field.title, 'years', z)}
                  />
                  <span
                    aria-hidden
                    className="bg-gray-100 py-2 px-3.5 rounded-r border-gray-400 border border-solid min-w-[92px] mr-2 flex items-center"
                  >
                    {z({
                      en: 'Years',
                      cy: 'flynedd',
                    })}
                  </span>
                </div>
              )}
              {field.type !== 'age' && (
                <MoneyInput
                  data-testid={field.type}
                  aria-required={hasRequired || undefined}
                  id={field.type}
                  key={field.type}
                  name={field.type}
                  className="mr-2 border-gray-600 border-l-0 max-w-[360px]"
                  isAllowed={({
                    floatValue,
                  }: {
                    floatValue: number | undefined;
                  }) => {
                    const updateChunk = field.type === 'updateChunk';

                    if (updateChunk) {
                      return (
                        (floatValue ?? 0) <=
                        Number(queryData.pot.replaceAll(',', ''))
                      );
                    }
                    return (
                      (floatValue ?? 0) >= 0 && (floatValue ?? 0) <= 999999999
                    );
                  }}
                  value={
                    queryData[field.type] ??
                    ((field.type === 'updateChunk' ? queryData.chunk : '') ||
                      (field.type === 'updateMonth' ? queryData.month : ''))
                  }
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onChange && onChange(e, field);
                  }}
                  aria-label={addUnitToAriaLabel(field.title, 'pounds', z)}
                />
              )}
            </fieldset>
          </Errors>
        );
      })}
    </>
  );
};
