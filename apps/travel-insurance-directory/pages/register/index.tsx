import { appTitle } from 'utils/helper/core/appTitle';
import { pageTitle } from 'utils/helper/core/pageTitle';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

const Page = () => {
  const { z } = useTranslation();
  const title = appTitle(z);

  return (
    <ToolPageLayout
      pageTitle={pageTitle('Register - Landing', z)}
      title={title}
      titleTag={'span'}
      noMargin={true}
      mainClassName="my-8 text-gray-800"
      className="pt-8 mb-4"
      showLanguageSwitcher={false}
    >
      <Container>
        <div className="lg:max-w-[980px] space-y-8">
          <BackLink href={`/`}>Back</BackLink>
          <Heading level="h1">
            Register your firm for the Travel Insurance Directory
          </Heading>
          <Paragraph>
            Firms authorised by the Financial Conduct Authority (FCA) can use
            this service to register for the Travel Insurance Directory.
          </Paragraph>
          <Paragraph>
            We will assess your application to ensure your firm meets the
            required risk appetite and capability standards for covering
            travellers with pre-existing medical conditions.
          </Paragraph>
          <Paragraph>
            What you will need before beginning your application, please ensure
            you have the following details to hand:
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
        </div>
      </Container>
    </ToolPageLayout>
  );
};

export default Page;
