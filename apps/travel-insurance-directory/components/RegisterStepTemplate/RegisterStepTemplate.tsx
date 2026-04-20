import { Suspense } from 'react';

import { ContentFactory } from 'components/ContentFactory';
import { FormWrapper } from 'components/FormWrapper';
import { RadioQuestion } from 'components/RadioQuestion';
import { FormErrorsState } from 'components/Register/Register';
import { ErrorSummaryProvider } from 'context/ErrorSummaryProvider';
import { PageContent } from 'data/pages/register/types';
import { TravelInsuranceDirectory } from 'pages';

type StepKey = `step${number}`;

type RegisterStepTemplateProps = {
  step: StepKey;
  isChangeAnswer: boolean;
  initialErrors: FormErrorsState | null;
  initialValues: Record<string, string> | null;
  pageDataMap: Record<StepKey, PageContent>;
  currentPath: '/register/firm' | '/register/scenario';
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
  formAction = '/api/register/firm-radio-submit',
  wrapperClassName = 'mt-6',
}: RegisterStepTemplateProps) => {
  const pageData = pageDataMap[step];
  if (!pageData) return null;

  const defaultValue = initialValues?.[pageData?.radioInput?.key];

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
                  initialValue={defaultValue ?? ''}
                />
              </ContentFactory>
            </FormWrapper>
          </Suspense>
        </TravelInsuranceDirectory>
      )}
    </ErrorSummaryProvider>
  );
};
