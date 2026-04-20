import { Suspense } from 'react';

import { RegisterResultPage } from 'components/RegisterResultPage';
import { elligible } from 'data/pages/register/eligibility';
import { TravelInsuranceDirectory } from 'pages';

const { heading, copy } = elligible;

const Page = () => (
  <TravelInsuranceDirectory
    browserTitle={`Register - ${heading}`}
    heading={heading}
    showLanguageSwitcher={false}
    displayBacklink={false}
  >
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterResultPage copy={copy} />
    </Suspense>
  </TravelInsuranceDirectory>
);

export default Page;
