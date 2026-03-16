import { Suspense } from 'react';

import { GetServerSideProps } from 'next';

import { FormWrapper } from 'components/FormWrapper';
import { RadioQuestion } from 'components/RadioQuestion';
import { FormErrorsState } from 'components/Register/Register';
import { ErrorSummaryProvider } from 'context/ErrorSummaryProvider';
import { page } from 'data/pages/register/firmQuestions';
import { getIronSession, IronSessionData } from 'iron-session';
import { fetchFirm } from 'lib/firms/fetchFirm';
import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import { TravelInsuranceDirectory } from 'pages';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

type PageProps = {
  step: keyof typeof page;
  initialErrors: FormErrorsState | null;
  initialValues: Record<string, string> | null;
};

const Page = ({ step, initialErrors, initialValues }: PageProps) => {
  const pageData = page[step];

  const currentStepNumber = Number.parseInt(step.replace('step', ''), 10);
  const nextStep =
    pageData.nextPage ??
    (`/register/firm/step${currentStepNumber + 1}` as keyof typeof page);

  const defaultValue = initialValues?.[pageData?.radioInput?.key];

  return (
    <ErrorSummaryProvider
      initialErrors={initialErrors}
      initialValues={{}}
      isRadio={true}
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
              copy={pageData.copy}
              input={pageData.radioInput}
              formAction={`/api/register/firm-radio-submit`}
              nextStep={nextStep}
              currentPath={`/register/firm/${step}`}
              currentStep={step}
            >
              <RadioQuestion
                radioInput={pageData.radioInput}
                initialValue={defaultValue ?? ''}
              />
            </FormWrapper>
          </Suspense>
        </TravelInsuranceDirectory>
      )}
    </ErrorSummaryProvider>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, query } = context;

  const session = await getIronSession<IronSessionData>(
    req,
    res,
    registerSessionOptions,
  );

  let firmData = null;
  let initialValues = null;

  if (session.db_id) {
    firmData = await fetchFirm(session.db_id);
    if (firmData.response) {
      initialValues = firmData.response;
    }
  }

  const errorCookie = getCookieAndCleanUp(context, 'form_error', true);
  const initialErrors = errorCookie?.fields ?? null;

  return {
    props: { step: query.step, initialValues, initialErrors },
  };
};
