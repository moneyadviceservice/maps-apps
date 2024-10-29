import { ReactNode, useMemo, useState } from 'react';
import {
  MortgageAffordability,
  getServerSidePropsDefault,
  Errors,
  HiddenFields,
  MacSteps,
} from '.';
import { TabLayout } from 'layouts/TabLayout';
import { IncomeFieldKeys, stepContent } from 'data/mortgage-affordability/step';
import { DynamicFields } from 'components/DynamicFields';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { tabDataTransformer } from 'utils/TabToolUtils';
import {
  FormField,
  FormData,
  ConditionalFields,
  FormValidationObj,
} from 'data/types';
import { ParsedUrlQuery } from 'querystring';
import { convertQueryToUrlSearchParams } from 'utils/convertQueryToUrlSearchParams';
import { realtimeValidation } from 'utils/MortgageAffordabilityCalculator';
import { MACAnalytics } from 'components/Analytics';
import { getErrors } from 'utils/TabToolUtils/getErrors';
import { errorMessages } from 'data/mortgage-affordability/errors';
import { Button, Paragraph } from '@maps-digital/shared/ui';

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
      return <Paragraph className="text-2xl mb-8">{content}</Paragraph>;
    } else {
      return content;
    }
  };

  return (
    <>
      {expandableInfoSection(stepData)}
      <div className="grid grid-cols-12 gap-4 w-full">
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
            <div className="flex justify-start flex-col lg:gap-4 md:flex-row my-8">
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
  urlPath: string;
  isEmbed: boolean;
  currentStep: string;
  formData: FormData;
  errors: Record<IncomeFieldKeys, string>;
  query: ParsedUrlQuery;
};

const Step = ({
  lang,
  urlPath,
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
  const toolBaseUrl = `/${lang}${urlPath}`;
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

  return (
    <MortgageAffordability
      isEmbed={isEmbed}
      pageErrors={errorObj.pageErrors}
      step={step}
      errorKeyPrefix="q-"
    >
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
        />
      </MACAnalytics>
    </MortgageAffordability>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
