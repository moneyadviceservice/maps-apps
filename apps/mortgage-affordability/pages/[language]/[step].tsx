import { ReactNode, useMemo, useState } from 'react';

import { MACAnalytics } from 'components/Analytics';
import { errorMessages } from 'data/mortgage-affordability/errors';
import { IncomeFieldKeys, stepContent } from 'data/mortgage-affordability/step';
import { ParsedUrlQuery } from 'querystring';
import { realtimeValidation } from 'utils/MortgageAffordabilityCalculator';

import { Button } from '@maps-react/common/components/Button';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DynamicFields } from '@maps-react/pension-tools/components/DynamicFields';
import { TabLayout } from '@maps-react/pension-tools/layouts/TabLayout';
import {
  ConditionalFields,
  FormData,
  FormField,
  FormValidationObj,
} from '@maps-react/pension-tools/types/forms';
import { convertQueryToUrlSearchParams } from '@maps-react/pension-tools/utils/convertQueryToUrlSearchParams';
import { tabDataTransformer } from '@maps-react/pension-tools/utils/TabToolUtils';
import { getErrors } from '@maps-react/pension-tools/utils/TabToolUtils/getErrors';

import {
  Errors,
  getServerSidePropsDefault,
  HiddenFields,
  MacSteps,
  MortgageAffordability,
} from '.';

type FormContentProps = {
  stepFields: FormField[];
  stepData: string | ReactNode;
  conditionalFields: ConditionalFields;
  fieldErrors: Errors;
  formData: FormData;
  hiddenFields: ReactNode;
  buttonText: string;
  validation?: FormValidationObj;
  currentStep: string;
  setToolStarted: (val: boolean) => void;
};

const FormContent = ({
  stepFields,
  stepData,
  conditionalFields,
  fieldErrors,
  formData,
  hiddenFields,
  buttonText,
  validation,
  currentStep,
  setToolStarted,
}: FormContentProps) => {
  const [updatedFormData, setUpdatedFormData] = useState<FormData>(formData);
  const [realTimeErrors, setRealTimeErrors] = useState<Errors>(fieldErrors);
  const [touchedFields, setTouchedFields] = useState<string[]>([]);

  const updateFormData = (formFieldKey: string, formFieldValue: string) => {
    if (!touchedFields.includes(formFieldKey)) {
      setTouchedFields([...touchedFields, formFieldKey]);
      formFieldValue && setToolStarted(true);
    }

    const updatedData = {
      ...updatedFormData,
      [formFieldKey]: formFieldValue,
    };
    setUpdatedFormData(updatedData);

    const fieldValidation = validation?.[formFieldKey];
    if (fieldValidation) {
      const validation = realtimeValidation(
        currentStep,
        updatedData,
        formFieldKey,
        realTimeErrors,
        fieldValidation,
      );

      setRealTimeErrors(validation);
    }
  };

  const expandableInfoSection = (content: string | ReactNode): ReactNode => {
    if (typeof content === 'string') {
      return <Paragraph className="mb-8 text-2xl">{content}</Paragraph>;
    } else {
      return content;
    }
  };

  return (
    <>
      {expandableInfoSection(stepData)}
      <div className="grid w-full grid-cols-12 gap-4">
        <div className="w-full col-span-12 md:col-span-7 lg:col-span-8">
          <form
            action={'/api/mortgage-affordability-calculator/submit-answer'}
            method="POST"
            id="mortgage-affordability-calculator"
          >
            <DynamicFields
              formFields={stepFields}
              formErrors={realTimeErrors}
              savedData={updatedFormData}
              hiddenFields={hiddenFields}
              conditionalFields={conditionalFields}
              updateSavedValues={updateFormData}
            />
            <div className="flex flex-col justify-start my-8 lg:gap-4 md:flex-row">
              <Button
                className={'md:my-8'}
                variant="primary"
                id={'continue'}
                type="submit"
                form="mortgage-affordability-calculator"
              >
                {buttonText}
              </Button>
            </div>
          </form>
        </div>
        <div className="w-full col-span-12 md:col-span-5 lg:col-span-4"></div>
      </div>
    </>
  );
};

type Props = {
  lang: string;
  isEmbed: boolean;
  currentStep: string;
  formData: FormData;
  errors: Record<IncomeFieldKeys, string>;
  query: ParsedUrlQuery;
};

const Step = ({
  lang,
  isEmbed,
  currentStep,
  formData,
  errors,
  query,
}: Props) => {
  const { z } = useTranslation();
  const [toolStarted, setToolStarted] = useState(
    Object.keys(formData).length > 0,
  );
  const { steps } = useMemo(() => stepContent(z), [lang]);
  const toolBaseUrl = `/${lang}/`;
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);
  const previousStep = steps[currentStepIndex - 1]?.key;
  const isLastStep = steps.length === currentStepIndex + 1;
  const nextStep = isLastStep ? 'results' : steps[currentStepIndex + 1]?.key;
  const { content, fields, result } = steps[currentStepIndex];
  const errorObj = useMemo(() => getErrors(errors, z, errorMessages), [errors]);

  const { tabContentHeadings, fieldData } = useMemo(
    () =>
      tabDataTransformer(
        formData,
        steps,
        toolBaseUrl,
        errorObj.acdlErrors,
        isEmbed,
      ),
    [formData, steps, toolBaseUrl, errorObj.acdlErrors, isEmbed],
  );
  const { validation, conditionalFields, acdlErrors } = fieldData;

  let backHref = undefined;

  if (previousStep) {
    backHref = `${toolBaseUrl}${previousStep}`;
  } else if (!isEmbed) {
    backHref = toolBaseUrl;
  }
  const searchParams = convertQueryToUrlSearchParams(query).toString();
  const backLink = backHref
    ? {
        href: `${backHref}?${searchParams}`,
        title: z({ en: 'Back', cy: 'Yn ôl' }),
      }
    : undefined;

  const step = (currentStepIndex + 1) as MacSteps;

  const errorSection = errorObj.pageErrors && (
    <ErrorSummary
      title={z({
        en: 'There is a problem',
        cy: 'Mae yna broblem',
      })}
      errors={errorObj.pageErrors}
      errorKeyPrefix="q-"
      classNames="lg:max-w-4xl"
      containerClassNames="mb-6"
    />
  );

  return (
    <MortgageAffordability isEmbed={isEmbed} step={step}>
      <MACAnalytics
        currentStep={step}
        formData={formData}
        acdlErrors={acdlErrors}
        toolStarted={toolStarted}
      >
        <TabLayout
          tabLinks={[]}
          currentTab={currentStepIndex + 1}
          tabHeadings={tabContentHeadings}
          tabContent={
            content &&
            fields && (
              <FormContent
                stepData={content}
                stepFields={fields}
                conditionalFields={conditionalFields}
                fieldErrors={errorObj.fieldErrors}
                formData={formData}
                hiddenFields={
                  <HiddenFields
                    isEmbed={isEmbed}
                    lang={lang}
                    toolBaseUrl={toolBaseUrl}
                    nextStep={nextStep}
                    formData={formData}
                    validation={validation}
                    currentStepIndex={currentStepIndex}
                    currentStep={currentStep}
                  />
                }
                buttonText={steps[currentStepIndex].buttonText}
                validation={validation[currentStepIndex]}
                currentStep={currentStep}
                setToolStarted={setToolStarted}
              />
            )
          }
          toolBaseUrl={toolBaseUrl}
          backLink={backLink}
          hasErrors={!!errorObj.pageErrors}
          buttonFormId={!result ? 'mortgage-affordability-calculator' : ''}
          errorSection={errorSection}
        />
      </MACAnalytics>
    </MortgageAffordability>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
