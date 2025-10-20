import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H3 } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { SocialShareTool } from '@maps-react/common/components/SocialShareTool';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { Container } from '@maps-react/core/components/Container';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';

import { transformErrorsForSummary } from '../../utils/validation/getDateFieldAnchor';
import { renderField as renderFieldUtil } from './fieldRenderer';
import {
  BaseCalculatorProps,
  CalculatorField,
  PropertyTaxCalculatorInput,
  PropertyTaxCalculatorResult,
  ValidationResult,
} from './types';

export const BaseCalculator = ({
  config,
  initialValues = {},
  calculated,
  analyticsData,
  isEmbedded,
  onCalculate,
}: BaseCalculatorProps<
  PropertyTaxCalculatorInput,
  PropertyTaxCalculatorResult
>) => {
  const { z } = useTranslation();

  const { addEvent } = useAnalytics();
  const scrollToRef = useRef<HTMLDivElement | null>(null);
  const errorSummaryRef = useRef<{
    focus: () => void;
    scrollIntoView: () => void;
  } | null>(null);

  const fields =
    typeof config.fields === 'function' ? config.fields(z) : config.fields;

  const [values] = useState<PropertyTaxCalculatorInput>(() => ({
    ...fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.defaultValue ?? '',
      }),
      {} as PropertyTaxCalculatorInput,
    ),
    ...initialValues,
  }));

  const [trackingStarted, setTrackingStarted] = useState(false);
  const [completionTrackingStarted, setCompletionTrackingStarted] =
    useState(false);
  const [fieldTracking, setFieldTracking] = useState<Record<string, boolean>>(
    {},
  );

  const validationResult: ValidationResult = (calculated &&
    config.validateForm?.(values, z)) || { errors: {} };

  const errors = validationResult.errors;
  const fieldSpecificErrors = validationResult.fieldErrors;

  const anyErrors = Object.values(errors).some(
    (errorArray) => errorArray.length > 0,
  );

  // Calculate result only if there are no validation errors
  const result = calculated && !anyErrors ? config.calculate(values) : null;

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
      // Only track if it's not a keydown, or if it's a numeric keydown
      if (
        event.type === 'keydown' &&
        !/\d/.test((event as React.KeyboardEvent<HTMLInputElement>).key)
      ) {
        return;
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
  const renderField = (field: CalculatorField) =>
    renderFieldUtil({
      field,
      errors,
      fieldSpecificErrors,
      values,
      config,
      z,
      fireToolStartEvent,
      handleToolInteractionEvent,
    });

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
          fields.find((f) => f.name === fieldName)?.type === 'money'
            ? 'MoneyInput'
            : 'Select',
        reactCompName: fieldName,
        errorMessage: error,
      });

      return Object.entries(errors).flatMap(([fieldName, fieldErrors]) =>
        fieldErrors.map((error) => mapFieldError(fieldName, error)),
      );
    },
    [fields],
  );

  useEffect(() => {
    if (anyErrors) {
      const errorDetails = createErrorDetails(errors);
      const hasNoErrors = calculated && !anyErrors;
      const toolStep = hasNoErrors ? 2 : 1;
      const stepName = hasNoErrors
        ? config.analyticsSteps?.results ?? 'Results'
        : config.analyticsSteps?.calculate ?? 'Calculate';

      addEvent({
        event: 'errorMessage',
        eventInfo: {
          toolName: config.analyticsToolName,
          toolStep,
          stepName,
          errorDetails,
        },
      });
    }
  }, [anyErrors, errors, calculated, config, addEvent, createErrorDetails]);

  useEffect(() => {
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
        <div className="space-y-4 text-gray-800 lg:max-w-4xl">
          {!isEmbedded && (
            <div className="pb-2">
              {config.pagePath && (
                <BackLink href={config.pagePath(z)}>
                  {z({
                    en: 'Back',
                    cy: 'Yn ôl',
                  })}
                </BackLink>
              )}
            </div>
          )}
          <ErrorSummary
            ref={errorSummaryRef}
            title={z({ en: 'There is a problem', cy: 'Mae yna broblem' })}
            errors={transformErrorsForSummary(errors, fieldSpecificErrors)}
          />
          {typeof config.introduction === 'function'
            ? config.introduction(isEmbedded, z)
            : config.introduction}
        </div>
      </Container>

      <hr className="border-slate-400" />

      <Container>
        <form
          id="calculator"
          method="get"
          action="#calculator"
          className="lg:max-w-4xl"
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

          <div className="flex flex-col lg:flex-row-reverse lg:flex-nowrap">
            <div
              className={`mb-8 w-full lg:w-1/2 ${
                calculated && result ? 'order-2 lg:order-none' : ''
              }`}
            >
              <div
                className={`${
                  (calculated &&
                    result &&
                    'mb-0 mt-8 lg:mt-0 md-8 sm:mb-[0px]') ||
                  ''
                } lg:ml-8`}
              >
                {calculated && result && (
                  <InformationCallout>
                    <div id="info-element">
                      <div className="p-3 lg:p-8">
                        <div className="break-words t-result">
                          {config.resultTitle && (
                            <H3 className="mb-4 text-xl">
                              {config.resultTitle(values, z)}
                            </H3>
                          )}
                          {config.formatResult(result, values, z)}
                        </div>
                      </div>
                    </div>
                  </InformationCallout>
                )}
                {calculated && result && config.howIsItCalculated && (
                  <div className="mt-4 -mb-10 lg:hidden">
                    <div className="lg:max-w-4xl">
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
              </div>
            </div>

            <div
              className={`w-full ${
                calculated ? '' : 'mb-8 order-1'
              } lg:w-1/2 lg:order-none`}
            >
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

                  {fields.map(renderField)}

                  <Button
                    type="submit"
                    analyticsClassName="tool-nav-submit tool-nav-complete"
                    className={`w-full lg:w-auto ${config.name.toLowerCase()}-${
                      calculated ? 'recalculate' : 'calculate'
                    }`}
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
            <div className="lg:max-w-4xl">
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
          <div className="lg:max-w-4xl">{config.didYouKnow(isEmbedded, z)}</div>
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
          <div className="lg:max-w-4xl">
            {' '}
            {config.haveYouTried(isEmbedded, z)}
          </div>
          <div className="lg:max-w-4xl">
            {' '}
            <ToolFeedback />
            <div className="flex flex-col justify-between py-6 mt-8 border-t print:hidden t-social-sharing sm:flex-row border-slate-400">
              <SocialShareTool
                url={config.pagePath ? config.pagePath(z) : ''}
                title={z({
                  en: 'Share this tool',
                  cy: 'Rhannwch yr offeryn hwn',
                })}
                subject={z({
                  en: `${config.title} - See how much tax you‘ll pay`,
                  cy: `${config.title} – Gweler faint o dreth y byddwch yn ei thalu`,
                })}
                xTitle={z({
                  en: `${config.title} - See how much tax you’ll pay`,
                  cy: `${config.title} – Gweler faint o dreth y byddwch yn ei thalu`,
                })}
              />
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};
