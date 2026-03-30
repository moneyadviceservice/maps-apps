import {
  ChangeEvent,
  ComponentType,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { H1, H2 } from '@maps-react/common/components/Heading';
import { Container } from '@maps-react/core/components/Container';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { Question } from '@maps-react/form/types';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import {
  FormContentAnlyticsData,
  PensionPotCalculatorResults,
  PensionPotCalculatorType,
} from '../../types';
import { getErrorRequiredOrInvalid } from '../../utils/getErrorRequiredOrInvalid';
import { isInputAllowedDefault } from '../../utils/inputValidation';
import { PensionToolsInputs } from '../PensionToolsInputs/PensionToolsInputs';

export type ErrorField = {
  field: string;
  type: string;
};
export type ErrorObject = {
  [key: string]: ErrorField;
};
export interface PensionPotCalculatorProps {
  lang?: string;
  isEmbed: boolean;
  errors: ErrorObject;
  queryData: DataFromQuery;
  action: string;
  analyticsData: FormContentAnlyticsData;
  data: PensionPotCalculatorType;
  fields: Question[];
  fieldsEn: Question[];
  results: ComponentType<PensionPotCalculatorResults>;
  updateInputs?: string[];
  handleErrors?: (
    errors: ErrorObject,
    values: Record<string, string>,
  ) => ErrorObject;
}
export const PensionPotCalculator = ({
  isEmbed,
  errors,
  queryData = {},
  action,
  lang,
  analyticsData,
  data,
  fields,
  fieldsEn,
  results: Results,
  updateInputs = [],
  handleErrors,
}: PensionPotCalculatorProps) => {
  const { addEvent } = useAnalytics();

  const router = useRouter();
  const [clientErrors, setClientErrors] = useState<ErrorObject>({});
  const inputInteracted = useRef<string[]>([]);
  const toolInit = useRef<boolean>(false);
  const toolStarted = useRef<boolean>(false);
  const toolCompleted = useRef<boolean>(false);
  const currentInput = useRef<string>('');
  const refSubmit = useRef<HTMLInputElement>(null);
  const refError = useRef<HTMLInputElement>(null);

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

      const err = getErrorRequiredOrInvalid(inputData);

      const errors = handleErrors ? handleErrors(err, inputData) : err;

      const getQuery = () => {
        const q = {
          ...router.query,
          ...inputData,
        };

        //Remove additional fields from query for some tools
        updateInputs.forEach((i) => {
          delete q[i];
        });
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
    [fields, handleErrors, router, submitTracking, updateInputs],
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
          .map((field) => {
            return queryData[fields[Number(field)].type];
          })
          .every((v) => {
            return v !== undefined;
          });

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
          <H2 className="mb-6 text-blue-700 md:mb-8">{data.title}</H2>
        ) : (
          <H1 className="mb-6 text-blue-700 md:mb-8">{data.title}</H1>
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
            name="isEmbedded"
            value={isEmbed ? 'true' : 'false'}
          />
          {fields
            .filter((f) => !updateInputs.includes(f.type))
            ?.map((field) => {
              return (
                <PensionToolsInputs
                  key={field.type}
                  field={field}
                  queryData={queryData}
                  onChange={(e, field) => {
                    analyticsTrack(e, field, true);
                  }}
                  errors={
                    Object.keys(clientErrors).length ? clientErrors : errors
                  }
                  isAllowed={({ floatValue }) =>
                    isInputAllowedDefault({ floatValue })
                  }
                  value={queryData[field.type] ?? ''}
                />
              );
            })}

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
          {isQueryValid(queryData) && (
            <Results
              queryData={queryData}
              fields={fields}
              data={data}
              onChange={(e: ChangeEvent<HTMLInputElement>, field: Question) =>
                analyticsTrack(e, field)
              }
            />
          )}
        </form>
      </div>
    </Container>
  );
};
