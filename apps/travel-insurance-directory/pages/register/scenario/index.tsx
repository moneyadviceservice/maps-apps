import { TravelInsuranceDirectory } from 'pages';

import { Button } from '@maps-react/common/components/Button';
import { Paragraph } from '@maps-react/common/components/Paragraph';

const heading = 'Confirm coverage for standard medical scenarios';

const Page = () => {
  return (
    <TravelInsuranceDirectory
      browserTitle={`Register - ${heading}`}
      heading={heading}
      showLanguageSwitcher={false}
      backLink="/register/firm/step3"
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

      <Button href={`/register/scenario/step1`} as="a">
        Continue
      </Button>
    </TravelInsuranceDirectory>
  );
};

export default Page;
