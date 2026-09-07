import { GetServerSideProps } from 'next';

import { SelfServeReviewSummary } from 'components/Account/SelfServeReviewSummary';
import { TripCoverConfirm } from 'components/Account/TripCover/TripCoverConfirm/TripCoverConfirm';
import { ErrorSummaryProvider } from 'context/ErrorSummaryProvider';
import { getSelfServeConfig } from 'data/analytics/selfServe/config';
import { getAnalyticsStepData } from 'data/analytics/selfServe/data';
import { TravelInsuranceDirectory } from 'layouts/TravelInsuranceDirectory';
import { isCoverAndServiceConfirmed } from 'lib/account/firmSectionStatus';
import type { ReviewSummarySection } from 'lib/account/reviewSummary/types';
import { mergeFirmWithSelfServeEditDraft } from 'lib/account/selfServeEditDraft';
import {
  clearCoverServiceDraftOnJourneyStart,
  shouldResetDraftOnEntry,
} from 'lib/account/selfServeEditDraft/clearDraftOnEntry';
import { buildCoverServiceSummary } from 'lib/account/tripCover/confirm/buildCoverServiceSummary';
import {
  loadRequiredAccountFirmParams,
  redirectToSelfServeStep,
} from 'lib/account/tripCover/shared';
import {
  confirmPath,
  getSelfServeRedirectIfIncomplete,
  serviceDetailsPath,
} from 'lib/account/tripCover/steps';
import type { FormErrorsState } from 'types/register';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

type PageProps = {
  firmId: string;
  sections: ReviewSummarySection[];
  initialErrors: FormErrorsState | null;
  backLink: string;
};

const heading = 'Service details';

const analyticsData = getAnalyticsStepData(
  'selfServe',
  'tripCover',
  9,
  heading,
);
const analyticsConfig = getSelfServeConfig('tripCover');

const Page = ({ firmId, sections, initialErrors, backLink }: PageProps) => {
  return (
    <ErrorSummaryProvider
      initialErrors={initialErrors ?? {}}
      initialValues={{}}
      isRadio
    >
      {({ errorSummarySection }) => (
        <TravelInsuranceDirectory
          browserTitle="Self Serve - Confirm details"
          backLink={backLink}
          heading="Confirm details"
          showLanguageSwitcher={false}
          errorSummarySection={errorSummarySection}
          analyticsData={analyticsData}
          analyticsConfig={analyticsConfig}
        >
          <SelfServeReviewSummary
            sections={sections}
            changeAnswerApi="/api/account/trip-cover/change-answer"
            changeAnswerHiddenFields={{ firmId }}
          />
          <TripCoverConfirm firmId={firmId} />
        </TravelInsuranceDirectory>
      )}
    </ErrorSummaryProvider>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context,
) => {
  const load = await loadRequiredAccountFirmParams(context, {} as PageProps);

  if (load.status === 'redirect') {
    return { redirect: load.redirect, props: load.emptyProps };
  }

  if (load.status === 'notFound') {
    return { notFound: true };
  }

  const { firmId, resolved } = load;

  if (shouldResetDraftOnEntry(context.query)) {
    // Only clear draft in edit mode (after first confirm).
    if (isCoverAndServiceConfirmed(resolved.firm)) {
      await clearCoverServiceDraftOnJourneyStart(resolved.firm);
    }
    return {
      redirect: { destination: confirmPath(firmId), permanent: false },
      props: {} as PageProps,
    };
  }

  const viewFirm = mergeFirmWithSelfServeEditDraft(resolved.firm);
  const incompleteRedirect = getSelfServeRedirectIfIncomplete(
    firmId,
    viewFirm,
    { page: 'confirm' },
  );

  if (incompleteRedirect) {
    return redirectToSelfServeStep(incompleteRedirect);
  }

  const errorCookie = getCookieAndCleanUp(context, 'form_error', true);

  // First-time confirm → previous step. After confirm (draft/edit mode) → account.
  const backLink = isCoverAndServiceConfirmed(resolved.firm)
    ? '/account'
    : serviceDetailsPath(firmId);

  return {
    props: {
      firmId,
      sections: buildCoverServiceSummary(firmId, viewFirm),
      initialErrors: errorCookie?.fields ?? null,
      backLink,
    },
  };
};
