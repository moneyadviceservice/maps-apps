import { Suspense } from 'react';

import { ContentFactory } from 'components/ContentFactory';
import { RadioQuestion } from 'components/form/RadioQuestion';
import { FormWrapper } from 'components/FormWrapper';
import { ErrorSummaryProvider } from 'context/ErrorSummaryProvider';
import { PageContent } from 'data/pages/register/types';
import { TravelInsuranceDirectory } from 'layouts/TravelInsuranceDirectory';
import { generateAnalyticsData } from 'lib/analytics/generateAnalyticsData';
import { getRegistrationFieldValue } from 'lib/register/registerFieldPaths';
import { FormErrorsState } from 'types/register';

type StepKey = `step${number}`;

type RegisterStepTemplateProps = {
  step: StepKey;
  isChangeAnswer: boolean;
  initialErrors: FormErrorsState | null;
  initialValues: Record<string, unknown> | null;
  pageDataMap: Record<StepKey, PageContent>;
  currentPath: '/register/firm' | '/register/scenario';
  currentFlow: 'firm' | 'scenario';
  formAction?: string;
  wrapperClassName?: string;
};

export const RegisterStepTemplate = ({
  step,
  isChangeAnswer,
  initialErrors,
  initialValues,
  pageDataMap,
  currentPath,
  currentFlow,
  formAction = '/api/register/radio-submit',
  wrapperClassName = 'mt-6',
}: RegisterStepTemplateProps) => {
  const pageData = pageDataMap[step];
  if (!pageData) return null;

  const currentStepNumber = Number.parseInt(step.replace('step', ''), 10);

  const analyticsData = generateAnalyticsData({
    heading: pageData.heading,
    category: 'Register',
    toolStep: `${currentStepNumber}`,
    stepName: step,
    currentFlow: currentFlow,
  });

  const defaultValue = getRegistrationFieldValue(
    initialValues,
    pageData.radioInput.key,
    currentPath,
  );

  return (
    <ErrorSummaryProvider
      initialErrors={initialErrors}
      initialValues={{}}
      isRadio
    >
      {({ errorSummarySection }) => (
        <TravelInsuranceDirectory
          browserTitle={`Register - ${pageData.heading}`}
          backLink={pageData.backLink}
          displayBacklink={!!pageData.backLink}
          heading={pageData.heading}
          showLanguageSwitcher={false}
          errorSummarySection={errorSummarySection}
          analyticsData={analyticsData}
          currentFlow={currentFlow}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <FormWrapper
              input={pageData.radioInput}
              formAction={`${formAction}?isChangeAnswer=${isChangeAnswer}`}
              currentPath={currentPath}
              currentStep={step}
              className={wrapperClassName}
            >
              <ContentFactory copy={pageData.copy}>
                <RadioQuestion
                  radioInput={pageData.radioInput}
                  initialValue={defaultValue}
                />
              </ContentFactory>
            </FormWrapper>
          </Suspense>
        </TravelInsuranceDirectory>
      )}
    </ErrorSummaryProvider>
  );
};
