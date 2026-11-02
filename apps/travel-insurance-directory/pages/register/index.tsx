import { TravelInsuranceDirectory } from 'layouts/TravelInsuranceDirectory';
import { generateAnalyticsData } from 'lib/analytics/generateAnalyticsData';
import { DEFAULT_LANGUAGE_HOME } from 'types/CONSTANTS';

import { Button } from '@maps-react/common/components/Button';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';

const heading = 'Register your firm for the Travel Insurance Directory';

const analyticsData = generateAnalyticsData({
  heading: heading,
  category: 'Register',
  toolStep: '0',
  stepName: 'Landing',
});

const Page = () => {
  return (
    <TravelInsuranceDirectory
      browserTitle={`Register - ${heading}`}
      heading={heading}
      showLanguageSwitcher={false}
      backLink={DEFAULT_LANGUAGE_HOME}
      analyticsData={analyticsData}
    >
      <Paragraph>
        Firms authorised by the Financial Conduct Authority (FCA) can use this
        service to register for the Travel Insurance Directory.
      </Paragraph>
      <Paragraph>
        We will assess your application to ensure your firm meets the required
        risk appetite and capability standards for covering travellers with
        pre-existing medical conditions.
      </Paragraph>
      <Paragraph>
        What you will need before beginning your application, please ensure you
        have the following details to hand:
      </Paragraph>
      <ListElement
        items={[
          'FCA Firm Reference Number (FRN)',
          'Confirmation of Financial Ombudsman Service (FOS) and FSCS coverage',
          'Details of the specific medical conditions or risk profiles you cover',
        ]}
        color="blue"
        variant="unordered"
        className="ml-5 mb-2"
      />
      <form method="POST" action="/api/register/start">
        <Button type="submit">Start</Button>
      </form>
    </TravelInsuranceDirectory>
  );
};

export default Page;
