import { Suspense } from 'react';

import { GetServerSideProps } from 'next';

import { Register } from 'components/Register';
import { FormErrorsState } from 'components/Register/Register';
import { ErrorSummaryProvider } from 'context/ErrorSummaryProvider';
import { page } from 'data/pages/register';
import { getIronSession, IronSessionData } from 'iron-session';
import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import TravelInsuranceDirectory from 'pages';
import { CreateUserObject } from 'types/register';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

interface PageProps {
  initialErrors?: FormErrorsState | null;
  initialValues?: CreateUserObject;
  displayOtp?: boolean;
}

const Page = ({ initialErrors, initialValues, displayOtp }: PageProps) => {
  return (
    <ErrorSummaryProvider
      initialErrors={initialErrors}
      initialValues={initialValues}
    >
      {({ errorSummarySection }) => (
        <TravelInsuranceDirectory
          browserTitle={page.createAccountPage.browserTitle}
          backLink="/register/step-1"
          heading={page.createAccountPage.heading}
          showLanguageSwitcher={false}
          errorSummarySection={errorSummarySection}
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
  const { req, res, query } = context;

  const session = await getIronSession<IronSessionData>(
    req,
    res,
    registerSessionOptions,
  );

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
