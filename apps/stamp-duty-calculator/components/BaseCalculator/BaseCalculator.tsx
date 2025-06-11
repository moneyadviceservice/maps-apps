import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H3 } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { Container } from '@maps-react/core/components/Container';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { Select } from '@maps-react/form/components/Select';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';

import { BaseCalculatorProps, CalculatorField } from './types';

export const BaseCalculator = <
  TInput extends Record<string, any> = any,
  TResult = any,
>({
  config,
  initialValues = {},
  calculated,
  analyticsData,
  isEmbedded,
  onCalculate,
}: BaseCalculatorProps<TInput, TResult>) => {
  const { z } = useTranslation();
  const { addEvent } = useAnalytics();
  const scrollToRef = useRef<HTMLDivElement | null>(null);
  const errorSummaryRef = useRef<{
    focus: () => void;
    scrollIntoView: () => void;
  } | null>(null);

  const [values] = useState<TInput>(() => ({
    ...config.fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.defaultValue ?? '',
      }),
      {} as TInput,
    ),
    ...initialValues,
  }));

  const [trackingStarted, setTrackingStarted] = useState(false);
  const [completionTrackingStarted, setCompletionTrackingStarted] =
    useState(false);
  const [fieldTracking, setFieldTracking] = useState<Record<string, boolean>>(
    {},
  );

  // Calculate result
  const result = calculated ? config.calculate(values) : null;

  // Validate form
  const errors =
    calculated && config.validateForm ? config.validateForm(values, z) : {};
  const anyErrors = Object.values(errors).some(
    (errorArray) => errorArray.length > 0,
  );

  // Analytics helpers
  const fireToolStartEvent = useCallback(() => {
    if (!trackingStarted) {
      addEvent({
        ...analyticsData,
        event: calculated ? 'toolRestart' : 'toolStart',
      });
      setTrackingStarted(true);
    }
  }, [trackingStarted, calculated, analyticsData, addEvent]);

  const handleToolInteractionEvent = useCallback(
    (
      event:
        | KeyboardEvent<HTMLInputElement>
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLSelectElement>,
      reactCompType: string,
      fieldName: string,
    ) => {
      if (event.type === 'keydown') {
        const keyEvent = event as React.KeyboardEvent<HTMLInputElement>;
        if (!/\d/.test(keyEvent.key)) return;
      }

      if (!fieldTracking[fieldName]) {
        addEvent({
          event: 'toolInteraction',
          eventInfo: {
            toolName: config.analyticsToolName,
            toolStep: calculated ? 2 : 1,
            stepName: calculated
              ? config.analyticsSteps?.results ?? 'Results'
              : config.analyticsSteps?.calculate ?? 'Calculate',
            reactCompType,
            reactCompName: fieldName,
          },
        });
        setFieldTracking((prev) => ({ ...prev, [fieldName]: true }));
      }
    },
    [fieldTracking, calculated, config, addEvent],
  );

  // Render field based on type
  const renderField = (field: CalculatorField) => {
    const fieldErrors = errors[field.name] || [];
    const errorId = `${field.name}Error`;
    const fieldOptions =
      field.type === 'select' && config.fieldOptions?.[field.name]
        ? config.fieldOptions[field.name](z)
        : field.options;

    return (
      <div key={field.name} className="mb-3" id={`${field.name}Id`}>
        <Errors errors={fieldErrors}>
          <label
            htmlFor={field.name}
            className="inline-block mb-2 text-gray-800"
          >
            {field.label}
          </label>
          {fieldErrors.map((e) => (
            <div key={e} id={errorId}>
              <span className="sr-only">Error: </span>
              <div className="block mb-2 text-red-700">{e}</div>
            </div>
          ))}

          {field.type === 'select' && (fieldOptions || field.options) && (
            <Select
              id={field.name}
              name={field.name}
              hidePlaceholder={true}
              defaultValue={values[field.name]}
              options={fieldOptions || field.options || []}
              aria-describedby={fieldErrors.length > 0 ? errorId : ''}
              onChange={(e) => {
                fireToolStartEvent();
                handleToolInteractionEvent(e, 'Select', field.name);
              }}
            />
          )}

          {field.type === 'money' && (
            <MoneyInput
              id={field.name}
              name={field.name}
              defaultValue={values[field.name] ?? ''}
              aria-describedby={fieldErrors.length > 0 ? errorId : ''}
              onChange={(e) => {
                fireToolStartEvent();
                handleToolInteractionEvent(e, 'MoneyInput', field.name);
              }}
              onKeyDown={(e) => {
                handleToolInteractionEvent(e, 'MoneyInput', field.name);
              }}
            />
          )}
        </Errors>
      </div>
    );
  };

  // Effects
  useEffect(() => {
    if (!completionTrackingStarted && calculated && !anyErrors && result) {
      addEvent({
        ...analyticsData,
        event: 'toolCompletion',
      });
      setCompletionTrackingStarted(true);
    }
  }, [
    completionTrackingStarted,
    calculated,
    anyErrors,
    result,
    analyticsData,
    addEvent,
  ]);

  // Helper function to create error details
  const createErrorDetails = useCallback(
    (errors: Record<string, string[]>) => {
      const mapFieldError = (fieldName: string, error: string) => ({
        reactCompType:
          config.fields.find((f) => f.name === fieldName)?.type === 'money'
            ? 'MoneyInput'
            : 'Select',
        reactCompName: fieldName,
        errorMessage: error,
      });

      return Object.entries(errors).flatMap(([fieldName, fieldErrors]) =>
        fieldErrors.map((error) => mapFieldError(fieldName, error)),
      );
    },
    [config.fields],
  );

  useEffect(() => {
    if (anyErrors) {
      const errorDetails = createErrorDetails(errors);

      addEvent({
        event: 'errorMessage',
        eventInfo: {
          toolName: config.analyticsToolName,
          toolStep: calculated && !anyErrors ? 2 : 1,
          stepName:
            calculated && !anyErrors
              ? config.analyticsSteps?.results ?? 'Results'
              : config.analyticsSteps?.calculate ?? 'Calculate',
          errorDetails,
        },
      });
    }
  }, [anyErrors, errors, calculated, config, addEvent, createErrorDetails]);

  useEffect(() => {
    const infoElement = document.getElementById('info-element');
    if (infoElement && calculated && !anyErrors) {
      infoElement.focus();
      infoElement.scrollIntoView({ behavior: 'smooth' });
    }
    if (calculated && anyErrors && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
      errorSummaryRef.current.scrollIntoView();
    }
  }, [calculated, anyErrors]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Set recalculated value if already calculated
    if (calculated) {
      const recalculated = document.getElementById(
        'recalculated',
      ) as HTMLInputElement;
      if (recalculated) {
        recalculated.value = 'true';
      }
    }

    // Only prevent default if we have a custom onCalculate handler
    if (onCalculate) {
      e.preventDefault();
      onCalculate(values);
    }
    // Otherwise, let the form submit naturally with GET method
    // The form will submit and page will reload with new query params
  };

  return (
    <div ref={scrollToRef} className="space-y-9">
      <Container>
        <div className="mx-auto space-y-4 text-gray-800 lg:max-w-4xl">
          {anyErrors && (
            <ErrorSummary
              ref={errorSummaryRef}
              title={z({ en: 'This is a problem', cy: 'Mae yna broblem' })}
              errors={errors}
            />
          )}
          {typeof config.introduction === 'function'
            ? config.introduction(isEmbedded, z)
            : config.introduction}
        </div>
      </Container>

      <hr className="border-slate-400" />

      <Container>
        <form
          id={config.name.toLowerCase().replace(/\s+/g, '-')}
          method="get"
          className="mx-auto lg:max-w-4xl"
          onSubmit={handleSubmit}
        >
          <input
            type="hidden"
            name="isEmbedded"
            value={isEmbedded ? 'true' : 'false'}
          />
          <input type="hidden" name="calculated" value="true" />
          <input
            type="hidden"
            id="recalculated"
            name="recalculated"
            value="false"
          />

          <div className="flex flex-row-reverse flex-wrap lg:flex-nowrap">
            <div className="w-full mb-8 lg:w-1/2">
              <div
                className={`${
                  calculated && result ? 'mb-0 md-8 sm:mb-[0px]' : ''
                } lg:ml-8`}
              >
                <InformationCallout>
                  <div id="info-element" tabIndex={-1}>
                    <div className="p-3 lg:p-8">
                      {result ? (
                        <div className="t-result">
                          {config.resultTitle && (
                            <H3 className="mb-4 text-xl">
                              {config.resultTitle(values, z)}
                            </H3>
                          )}
                          {config.formatResult(result, values, z)}
                        </div>
                      ) : (
                        <>
                          <H3 className="mb-8 text-xl">
                            {(() => {
                              if (config.instructionsTitle) {
                                return typeof config.instructionsTitle ===
                                  'function'
                                  ? config.instructionsTitle(z)
                                  : config.instructionsTitle;
                              }
                              return z({
                                en: `Calculate your ${config.name}:`,
                                cy: `Cyfrifwch eich ${config.name}:`,
                              });
                            })()}
                          </H3>
                          {(() => {
                            if (config.instructions) {
                              return typeof config.instructions === 'function'
                                ? config.instructions(z)
                                : config.instructions;
                            }
                            return (
                              <ol className="px-5 text-gray-800 list-decimal marker:text-blue-800 marker:font-bold">
                                {config.fields.map((field) => (
                                  <li key={field.name} className="mb-3">
                                    {z({
                                      en: `${
                                        field.type === 'select'
                                          ? 'Select'
                                          : 'Enter'
                                      } ${field.label.toLowerCase()}`,
                                      cy: `${
                                        field.type === 'select'
                                          ? 'Dewiswch'
                                          : 'Rhowch'
                                      } ${field.label.toLowerCase()}`,
                                    })}
                                  </li>
                                ))}
                                <li className="mb-3">
                                  {z({
                                    en: 'Press "Calculate"',
                                    cy: 'Gwasgwch "Cyfrifo"',
                                  })}
                                </li>
                              </ol>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  </div>
                </InformationCallout>
              </div>
            </div>

            <div className={`w-full ${calculated ? '' : 'mb-8'} lg:w-1/2`}>
              {calculated && result && config.howIsItCalculated && (
                <div className="mb-8 lg:hidden">
                  <div className="mx-auto lg:max-w-4xl">
                    <ExpandableSection
                      title={z({
                        en: 'How is it calculated?',
                        cy: "Sut mae'n cael ei gyfrifo?",
                      })}
                    >
                      <div className="px-8 pt-8 pb-6 bg-gray-100">
                        <div className="space-y-4">
                          {config.howIsItCalculated(values, isEmbedded, z)}
                        </div>
                      </div>
                    </ExpandableSection>
                  </div>
                </div>
              )}

              <fieldset>
                <legend className="sr-only">
                  {z({
                    en: config.title + ' ' + 'form',
                    cy: 'Ffurflen' + ' ' + config.title,
                  })}
                </legend>
                <div className="space-y-9">
                  <div>
                    {z({
                      en: `You'll need to select and input both elements of this form to get a result. `,
                      cy: `Bydd angen i chi dewis a rhowch y ddau maes hyn i gael canlyniad.`,
                    })}
                  </div>

                  {config.fields.map(renderField)}

                  <Button
                    type="submit"
                    analyticsClassName="tool-nav-submit tool-nav-complete"
                    className={
                      calculated
                        ? `${config.name.toLowerCase()}-recalculate`
                        : `${config.name.toLowerCase()}-calculate`
                    }
                  >
                    {calculated
                      ? z({ en: 'Recalculate', cy: 'Ailgyfrifwch' })
                      : z({ en: 'Calculate', cy: 'Cyfrifwch' })}
                  </Button>
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      </Container>

      {calculated && result && config.howIsItCalculated && (
        <div className="hidden lg:block">
          <Container>
            <div className="mx-auto lg:max-w-4xl">
              <ExpandableSection
                title={z({
                  en: 'How is it calculated?',
                  cy: "Sut mae'n cael ei gyfrifo?",
                })}
              >
                <div className="px-8 pt-8 pb-6 bg-gray-100">
                  <div className="space-y-4">
                    {config.howIsItCalculated(values, isEmbedded, z)}
                  </div>
                </div>
              </ExpandableSection>
            </div>
          </Container>
        </div>
      )}

      {calculated && result && config.didYouKnow && (
        <Container>
          <div className="mx-auto lg:max-w-4xl">
            {config.didYouKnow(isEmbedded, z)}
          </div>
        </Container>
      )}

      {calculated && result && config.findOutMore && (
        <Container>{config.findOutMore(values, isEmbedded, z)}</Container>
      )}

      <hr className="border-slate-400" />

      {(!calculated || (calculated && !result)) && config.relatedLinks && (
        <Container>{config.relatedLinks(isEmbedded, z)}</Container>
      )}

      {calculated && result && config.haveYouTried && (
        <Container className={`${isEmbedded && 'pb-5'}`}>
          {config.haveYouTried(isEmbedded, z)}
          <ToolFeedback />
        </Container>
      )}
    </div>
  );
};
