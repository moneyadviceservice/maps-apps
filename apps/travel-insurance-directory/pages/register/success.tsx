import { Suspense } from 'react';

import { GetServerSideProps } from 'next';

import { RegisterResultPage } from 'components/RegisterResultPage';
import { elligible } from 'data/pages/register/eligibility';
import { generateAnalyticsData } from 'lib/analytics/generateAnalyticsData';
import { requireRegistrationAccess } from 'lib/register/registrationAccess';
import { TravelInsuranceDirectory } from 'layouts/TravelInsuranceDirectory';

const { heading, copy } = elligible;

const analyticsData = generateAnalyticsData({
  heading: heading,
  category: 'Register',
  toolStep: '21',
  stepName: 'success',
  currentFlow: 'scenario',
});

const Page = () => (
  <TravelInsuranceDirectory
    key="success"
    browserTitle={`Register - ${heading}`}
    heading={heading}
    showLanguageSwitcher={false}
    displayBacklink={false}
    analyticsData={analyticsData}
    currentFlow="scenario"
  >
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterResultPage copy={copy} />
    </Suspense>
  </TravelInsuranceDirectory>
);

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access = await requireRegistrationAccess(context, 'result');
  if (!access.allowed) {
    return access.result;
  }

  return { props: {} };
};
