import { Suspense } from 'react';

import { RegisterResultPage } from 'components/RegisterResultPage';
import { notElligible } from 'data/pages/register/eligibility';
import { TravelInsuranceDirectory } from 'pages';

const { heading, copy } = notElligible;

const Page = () => (
  <TravelInsuranceDirectory
    browserTitle={`Register - ${heading}`}
    heading={heading}
    showLanguageSwitcher={false}
  >
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterResultPage copy={copy} />
    </Suspense>
  </TravelInsuranceDirectory>
);

export default Page;
