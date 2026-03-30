import { Suspense, useState } from 'react';

import { GetServerSideProps } from 'next';

import { ConfirmDetailsAnswers } from 'components/ConfirmDetailsAnswers';
import { page as firmQuestions } from 'data/pages/register/firmQuestions';
import { page as scenarioQuestions } from 'data/pages/register/scenario';
import { getIronSession, IronSessionData } from 'iron-session';
import { fetchFirm } from 'lib/firms/fetchFirm';
import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import { TravelInsuranceDirectory } from 'pages';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

type PageProps = {
  registerAnswers: Record<string, string> | null;
};

const SUBMIT_ACTION = '/api/register/confirm';

const Page = ({ registerAnswers }: PageProps) => {
  const [isPending, setIsPending] = useState(false);

  const specificConditions = (
    registerAnswers as Partial<TravelInsuranceFirmDocument>
  )?.medical_coverage?.specific_conditions;

  return (
    <TravelInsuranceDirectory
      browserTitle={`Register - Confirm Details`}
      backLink={'/register/scenario/step19'}
      heading={'Confirm details'}
      showLanguageSwitcher={false}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Paragraph>You can change the answers if you need to.</Paragraph>
        <Heading level={'h2'}>Medical conditions</Heading>
        <ConfirmDetailsAnswers
          questions={firmQuestions}
          answers={registerAnswers}
          pagePath="/register/firm"
        />
        <Heading level={'h2'}>Coverage for standard medical scenarios</Heading>
        <ConfirmDetailsAnswers
          questions={scenarioQuestions}
          answers={specificConditions as unknown as Record<string, string>}
          pagePath="/register/scenario"
        />
        <form
          method="POST"
          action={SUBMIT_ACTION}
          onSubmit={() => setIsPending(true)}
        >
          <Button
            type="submit"
            disabled={isPending}
            data-testid="submit-button"
          >
            Continue
          </Button>
        </form>
      </Suspense>
    </TravelInsuranceDirectory>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const session = await getIronSession<IronSessionData>(
    req,
    res,
    registerSessionOptions,
  );

  let firmData = null;
  let registerAnswers = null;

  if (session.db_id) {
    firmData = await fetchFirm(session.db_id);
    if (firmData.response) {
      registerAnswers = firmData.response;
    }
  }

  return {
    props: { registerAnswers },
  };
};
