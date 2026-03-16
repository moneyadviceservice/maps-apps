import { Suspense } from 'react';

import { GetServerSideProps } from 'next';

import { FormWrapper } from 'components/FormWrapper';
import { RadioQuestion } from 'components/RadioQuestion';
import { page } from 'data/pages/register/scenario';
import { TravelInsuranceDirectory } from 'pages';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

type PageProps = {
  step: string;
};

const Page = ({ step }: PageProps) => {
  const pageStep = step as keyof typeof page;
  const pageData = page[pageStep];

  return (
    <TravelInsuranceDirectory
      browserTitle={`Register - ${pageData.heading}`}
      backLink={pageData.backLink}
      heading={pageData.heading}
      showLanguageSwitcher={false}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <FormWrapper
          copy={pageData.copy}
          input={pageData.radioInput}
          formAction={`/api/register/firm-radio-submit`}
          currentPath={`/register/firm/${step}`}
          currentStep={step}
        >
          <RadioQuestion radioInput={pageData.radioInput} initialValue={''} />
        </FormWrapper>
      </Suspense>
    </TravelInsuranceDirectory>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  const errorCookie = getCookieAndCleanUp(context, 'form_error', true);

  return {
    props: { step: query.step, initialErrors: errorCookie?.fields ?? null },
  };
};
