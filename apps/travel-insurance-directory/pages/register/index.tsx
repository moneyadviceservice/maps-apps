import { TravelInsuranceDirectory } from 'pages';

import { Button } from '@maps-react/common/components/Button';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';

const Page = () => {
  return (
    <TravelInsuranceDirectory
      browserTitle="Register - Landing"
      heading="Register your firm for the Travel Insurance Directory"
      showLanguageSwitcher={false}
      backLink="/"
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
      <Button href={`/register/step-1`} as="a">
        Start
      </Button>
    </TravelInsuranceDirectory>
  );
};

export default Page;
