import { Suspense, useState } from 'react';

import { GetServerSideProps } from 'next';

import { ConfirmDetailsAnswers } from 'components/ConfirmDetailsAnswers';
import { page as firmQuestions } from 'data/pages/register/firmQuestions';
import { page as scenarioQuestions } from 'data/pages/register/scenario';
import { getRegistrationAnswersSource } from 'lib/account/registrationAnswersSource';
import { ensureRenewalDraftForRegisterFlow } from 'lib/account/ensureRenewalDraftForRegisterFlow';
import { generateAnalyticsData } from 'lib/analytics/generateAnalyticsData';
import { requireRegistrationAccess } from 'lib/register/registrationAccess';
import { resolveRegisterFirm } from 'lib/register/resolveRegisterFirm';
import { TravelInsuranceDirectory } from 'layouts/TravelInsuranceDirectory';
import { SAVE_PROGRESS_PATH } from 'types/CONSTANTS';
import { FormErrorsState } from 'types/register';
import { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';

type PageProps = {
  registerAnswers: MainTravelInsuranceFirmDocument | null;
  initialErrors: FormErrorsState | null;
};

const SUBMIT_ACTION = '/api/register/confirm';

const heading = 'Confirm details';

const analyticsData = generateAnalyticsData({
  heading: heading,
  category: 'Register',
  toolStep: '20',
  stepName: 'confirm-details',
  currentFlow: 'scenario',
});

const Page = ({ registerAnswers, initialErrors }: PageProps) => {
  const [isPending, setIsPending] = useState(false);

  const specificConditions =
    registerAnswers?.medical_coverage?.specific_conditions;

  return (
    <TravelInsuranceDirectory
      key="confirm-details"
      browserTitle={`Register - Confirm Details`}
      backLink={'/register/scenario/step19'}
      heading={'Confirm details'}
      showLanguageSwitcher={false}
      errorSummarySection={
        initialErrors && (
          <ErrorSummary
            title={'There is a problem'}
            errors={{
              general: [
                'Missing answers. Please answer all the questions before submitting.',
              ],
            }}
          />
        )
      }
      analyticsData={analyticsData}
      currentFlow="scenario"
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
          answers={specificConditions ?? null}
          pagePath="/register/scenario"
        />
        <form
          method="POST"
          action={SUBMIT_ACTION}
          onSubmit={() => setIsPending(true)}
        >
          <div className="flex flex-col items-center justify-start md:gap-4 md:flex-row mt-6">
            <Button
              type="submit"
              disabled={isPending}
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
        </form>
      </Suspense>
    </TravelInsuranceDirectory>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access = await requireRegistrationAccess(context, 'firm');
  if (!access.allowed) {
    return access.result;
  }

  const { query } = context;
  const session = access.session;

  let registerAnswers = null;

  if (session.db_id) {
    let firm = await resolveRegisterFirm(session);
    if (firm) {
      firm = await ensureRenewalDraftForRegisterFlow(firm, session);
      registerAnswers = getRegistrationAnswersSource(firm);
    }
  }

  return {
    props: { registerAnswers, initialErrors: query.error ?? null },
  };
};
