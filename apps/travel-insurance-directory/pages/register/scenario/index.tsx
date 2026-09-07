import { GetServerSideProps } from 'next';

import { generateAnalyticsData } from 'lib/analytics/generateAnalyticsData';
import { requireRegistrationAccess } from 'lib/register/registrationAccess';
import { TravelInsuranceDirectory } from 'layouts/TravelInsuranceDirectory';
import { SAVE_PROGRESS_PATH } from 'types/CONSTANTS';

import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';

const heading = 'Confirm coverage for standard medical scenarios';

const analyticsData = generateAnalyticsData({
  heading: heading,
  category: 'Register',
  toolStep: '0',
  stepName: 'Landing',
  currentFlow: 'scenario',
});

const Page = () => {
  return (
    <TravelInsuranceDirectory
      browserTitle={`Register - ${heading}`}
      heading={heading}
      showLanguageSwitcher={false}
      backLink="/register/firm/step3"
      analyticsData={analyticsData}
      currentFlow="scenario"
    >
      <Paragraph>
        You have confirmed that you will offer travel insurance to people with
        any/most types of serious medical conditions. Please now confirm in
        which of the fifteen hypothetical scenarios on the following pages your
        firm would offer single trip cover (without medical exclusions).
      </Paragraph>
      <Paragraph>
        Please select &apos;yes&apos; or &apos;no&apos; for the following
        scenarios.
      </Paragraph>

      <div className="flex flex-col items-center justify-start md:gap-4 md:flex-row mt-6">
        <Button
          href={`/register/scenario/step1`}
          as="a"
          data-testid="submit-button"
        >
          Continue
        </Button>
        <Button
          className="flex items-center mt-6 md:mt-0"
          variant="link"
          href={SAVE_PROGRESS_PATH}
          as="a"
          data-testid="save-button"
          iconLeft={<Icon type={IconType.BOOKMARK} />}
        >
          {'Save and come back later'}
        </Button>
      </div>
    </TravelInsuranceDirectory>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access = await requireRegistrationAccess(context, 'firm');
  if (!access.allowed) {
    return access.result;
  }

  return { props: {} };
};
