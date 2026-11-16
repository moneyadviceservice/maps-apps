import { GetServerSideProps } from 'next';

import { ContentFactory } from 'components/ContentFactory';
import { page } from 'data/pages/register/save';
import { generateAnalyticsData } from 'lib/analytics/generateAnalyticsData';
import { requireRegistrationAccess } from 'lib/register/registrationAccess';
import TravelInsuranceDirectory from 'layouts/TravelInsuranceDirectory';

import { Button } from '@maps-react/common/components/Button';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';

type Props = {
  email: string | null;
  hasError: boolean;
};

const analyticsData = generateAnalyticsData({
  heading: page.save.heading,
  category: 'Register',
  toolStep: '0',
  stepName: 'Save',
  currentFlow: 'save',
});

const Page = ({ email, hasError }: Props) => {
  const errors = hasError
    ? { 'save-progress-button': [page.save.errors?.apiError] }
    : null;

  return (
    <TravelInsuranceDirectory
      key="save"
      browserTitle={page.save.browserTitle}
      heading={page.save.heading}
      showLanguageSwitcher={false}
      errorSummarySection={
        errors && <ErrorSummary title={'There is a problem'} errors={errors} />
      }
      analyticsData={analyticsData}
      currentFlow="save"
    >
      <ContentFactory copy={page.save.copy}>{email}</ContentFactory>
      <div>
        <Button
          as={'a'}
          href="/api/register/save-progress"
          id="save-progress-button"
          data-testid="save-and-send-button"
        >
          {page.save.button.label}
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

  const { query } = context;
  const session = access.session;

  const error = (query?.error as string) ?? null;
  const hasError = !!error;

  const email = session.userData?.mail ?? null;

  return {
    props: { email, hasError },
  };
};
