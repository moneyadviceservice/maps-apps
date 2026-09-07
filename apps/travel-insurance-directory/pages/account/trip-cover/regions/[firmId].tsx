import { GetServerSideProps } from 'next';

import { RegionsCovered } from 'components/Account/TripCover/RegionsCovered';
import { ErrorSummaryProvider } from 'context/ErrorSummaryProvider';
import { getSelfServeConfig } from 'data/analytics/selfServe/config';
import { getAnalyticsStepData } from 'data/analytics/selfServe/data';
import {
  REGIONS_COVERED_FIELD_LABELS,
  REGIONS_COVERED_REQUIRED_MESSAGES,
} from 'data/pages/account/tripCover/tripCoverConfig';
import { TravelInsuranceDirectory } from 'layouts/TravelInsuranceDirectory';
import { isCoverAndServiceConfirmed } from 'lib/account/firmSectionStatus';
import { mergeFirmWithSelfServeEditDraft } from 'lib/account/selfServeEditDraft';
import {
  clearCoverServiceDraftOnJourneyStart,
  shouldResetDraftOnEntry,
} from 'lib/account/selfServeEditDraft/clearDraftOnEntry';
import { getSelectedCoverAreas } from 'lib/account/tripCover/RegionsCovered';
import { loadRequiredAccountFirmParams } from 'lib/account/tripCover/shared';
import { confirmPath, regionsPath } from 'lib/account/tripCover/steps';
import type { FormErrorsState } from 'types/register';
import type { CoverArea } from 'types/travel-insurance-firm';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

type PageProps = {
  firmId: string;
  initialSelectedAreas: CoverArea[];
  initialErrors: FormErrorsState | null;
  isChangeAnswer: boolean;
  backLink: string;
};

const heading = 'Regions covered';
const analyticsData = getAnalyticsStepData(
  'selfServe',
  'tripCover',
  1,
  heading,
);
const analyticsConfig = getSelfServeConfig('tripCover');

const Page = ({
  firmId,
  initialSelectedAreas,
  initialErrors,
  isChangeAnswer,
  backLink,
}: PageProps) => {
  return (
    <ErrorSummaryProvider
      initialErrors={initialErrors ?? {}}
      initialValues={{}}
      isRadio={true}
      fieldLabels={REGIONS_COVERED_FIELD_LABELS}
      errorMessageOverrides={REGIONS_COVERED_REQUIRED_MESSAGES}
    >
      {({ errorSummarySection }) => (
        <TravelInsuranceDirectory
          browserTitle="Self Serve - Regions covered"
          backLink={backLink}
          heading={heading}
          showLanguageSwitcher={false}
          errorSummarySection={errorSummarySection}
          analyticsData={analyticsData}
          analyticsConfig={analyticsConfig}
        >
          <RegionsCovered
            firmId={firmId}
            initialSelectedAreas={initialSelectedAreas}
            isChangeAnswer={isChangeAnswer}
          />
        </TravelInsuranceDirectory>
      )}
    </ErrorSummaryProvider>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context,
) => {
  const load = await loadRequiredAccountFirmParams(context, {});

  if (load.status === 'redirect') {
    return { redirect: load.redirect, props: load.emptyProps };
  }

  if (load.status === 'notFound') {
    return { notFound: true };
  }

  const { firmId, resolved } = load;

  if (shouldResetDraftOnEntry(context.query)) {
    if (isCoverAndServiceConfirmed(resolved.firm)) {
      await clearCoverServiceDraftOnJourneyStart(resolved.firm);
    }
    return {
      redirect: { destination: regionsPath(firmId), permanent: false },
      props: {} as PageProps,
    };
  }

  const isChangeAnswer = context.query.change === 'true';
  const errorCookie = getCookieAndCleanUp(context, 'form_error', true);
  const viewFirm = mergeFirmWithSelfServeEditDraft(resolved.firm);
  const initialSelectedAreas = getSelectedCoverAreas(
    viewFirm.trip_covers ?? [],
  );

  return {
    props: {
      firmId,
      initialSelectedAreas,
      initialErrors: errorCookie?.fields ?? null,
      isChangeAnswer,
      backLink: isChangeAnswer ? confirmPath(firmId) : '/account',
    },
  };
};
