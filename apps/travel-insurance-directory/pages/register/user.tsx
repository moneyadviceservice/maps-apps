import { Suspense } from 'react';

import { GetServerSideProps } from 'next';

import { Register } from 'components/Register';
import { ErrorSummaryProvider } from 'context/ErrorSummaryProvider';
import { page } from 'data/pages/register';
import { generateAnalyticsData } from 'lib/analytics/generateAnalyticsData';
import { requireRegistrationAccess } from 'lib/register/registrationAccess';
import TravelInsuranceDirectory from 'layouts/TravelInsuranceDirectory';
import { CreateUserObject, FormErrorsState } from 'types/register';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

interface PageProps {
  initialErrors?: FormErrorsState | null;
  initialValues?: CreateUserObject;
  displayOtp?: boolean;
}

const heading = page.createAccountPage.heading;

const analyticsData = generateAnalyticsData({
  heading: heading,
  category: 'Register',
  toolStep: '2',
  stepName: 'create-account',
  currentFlow: 'user',
});

const Page = ({ initialErrors, initialValues, displayOtp }: PageProps) => {
  return (
    <ErrorSummaryProvider
      initialErrors={initialErrors}
      initialValues={initialValues}
    >
      {({ errorSummarySection }) => (
        <TravelInsuranceDirectory
          browserTitle={page.createAccountPage.browserTitle}
          backLink="/register/fca"
          heading={heading}
          showLanguageSwitcher={false}
          errorSummarySection={errorSummarySection}
          analyticsData={analyticsData}
          currentFlow="user"
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Register initialValues={initialValues} displayOtp={displayOtp} />
          </Suspense>
        </TravelInsuranceDirectory>
      )}
    </ErrorSummaryProvider>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access = await requireRegistrationAccess(context, 'fca');
  if (!access.allowed) {
    return access.result;
  }

  const { query } = context;
  const session = access.session;

  const initialValues = session?.userData ?? null;

  const errorCookie = getCookieAndCleanUp(context, 'form_error', true);

  const showOtp = query?.showOtp === 'true';

  return {
    props: {
      initialErrors: errorCookie?.fields ?? null,
      initialValues,
      displayOtp: showOtp,
    },
  };
};
