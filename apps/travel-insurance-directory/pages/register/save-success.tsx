import { GetServerSideProps } from 'next';

import { ContentFactory } from 'components/ContentFactory';
import { page } from 'data/pages/register/save';
import { generateAnalyticsData } from 'lib/analytics/generateAnalyticsData';
import { requireRegistrationAccess } from 'lib/register/registrationAccess';
import TravelInsuranceDirectory from 'layouts/TravelInsuranceDirectory';

import { Button } from '@maps-react/common/components/Button';

type Props = {
  email: string | null;
  savedProgressLink: string | null;
};

const analyticsData = generateAnalyticsData({
  heading: page.saved.heading,
  category: 'Register',
  toolStep: '1',
  stepName: 'save-success',
  currentFlow: 'save',
});

const Page = ({ email, savedProgressLink }: Props) => {
  return (
    <TravelInsuranceDirectory
      key="save-success"
      browserTitle={page.saved.browserTitle}
      heading={page.saved.heading}
      showLanguageSwitcher={false}
      analyticsData={analyticsData}
      currentFlow="save"
    >
      <ContentFactory
        copy={page.saved.copy}
        copyPlaceholderValues={email ? { email } : undefined}
      />
      <div className="flex flex-col items-center justify-start md:gap-4 md:flex-row mt-6">
        <Button as={'a'} href={savedProgressLink ?? '/register'}>
          {page.saved.button.label}
        </Button>
        <Button
          className="mt-6 md:mt-0"
          as={'a'}
          variant={'secondary'}
          href="/api/register/save-progress"
          id="save-progress-button"
          data-testid="resend-button"
        >
          {page.saved.buttonRetry?.label}
        </Button>
      </div>
    </TravelInsuranceDirectory>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access = await requireRegistrationAccess(context, 'save');
  if (!access.allowed) {
    return access.result;
  }

  const session = access.session;
  const email = session.userData?.mail ?? null;
  const savedProgressLink = session.savedProgressLink ?? null;

  return {
    props: { email, savedProgressLink },
  };
};
