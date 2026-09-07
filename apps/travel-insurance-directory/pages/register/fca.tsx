import { GetServerSideProps } from 'next';

import { FcaLookup } from 'components/FcaLookup';
import { page } from 'data/pages/register';
import { getIronSession, IronSessionData } from 'iron-session';
import TravelInsuranceDirectory from 'layouts/TravelInsuranceDirectory';
import { accountSessionOptions } from 'lib/accountAuth/accountSessionOptions';
import { generateAnalyticsData } from 'lib/analytics/generateAnalyticsData';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';

type Props = {
  fcaNumber: string | null;
  hasError: boolean;
  errorType?: 'required' | 'invalid' | 'notFound' | 'apiError' | 'unknown';
};

const heading = page.fcaPage.heading;

const analyticsData = generateAnalyticsData({
  heading: heading,
  category: 'Register',
  toolStep: '1',
  stepName: 'FCA',
  currentFlow: 'user',
});

const Page = ({ fcaNumber, hasError, errorType }: Props) => {
  const pageErrors = page.fcaPage.inputs.frn[0].errors ?? '';

  const errors = hasError
    ? {
        frn: [pageErrors[errorType ?? 'unknown']],
      }
    : null;

  return (
    <TravelInsuranceDirectory
      browserTitle={page.fcaPage.browserTitle}
      backLink="/register"
      heading={heading}
      showLanguageSwitcher={false}
      topInfoSection={
        errors && <ErrorSummary title={'There is a problem'} errors={errors} />
      }
      analyticsData={analyticsData}
      currentFlow="user"
    >
      <FcaLookup initialFcaNumber={fcaNumber} hasError={hasError} />
    </TravelInsuranceDirectory>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  const errorType = (query?.error as string) ?? null;

  const hasError = !!errorType;

  const session = await getIronSession<IronSessionData>(
    context.req,
    context.res,
    accountSessionOptions,
  );

  const fcaNumber = session.fcaData?.frnNumber ?? null;

  return {
    props: { fcaNumber, hasError, errorType },
  };
};
