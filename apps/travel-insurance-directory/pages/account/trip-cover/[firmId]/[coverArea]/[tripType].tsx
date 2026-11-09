import { GetServerSideProps } from 'next';

import { TripCoverAgeLimits as TripCoverAgeLimitsForm } from 'components/Account/TripCover/TripCoverAgeLimits';
import { ErrorSummaryProvider } from 'context/ErrorSummaryProvider';
import { getSelfServeConfig } from 'data/analytics/selfServe/config';
import {
  getAnalyticsStepData,
  TripCoverStep,
} from 'data/analytics/selfServe/data';
import {
  getAgeLimitFieldLabels,
  getAgeLimitRequiredMessages,
  getAgePageHeading,
} from 'data/pages/account/tripCover/tripCoverConfig';
import { TravelInsuranceDirectory } from 'layouts/TravelInsuranceDirectory';
import { mergeFirmWithSelfServeEditDraft } from 'lib/account/selfServeEditDraft';
import { loadRequiredAccountFirmParams } from 'lib/account/tripCover/shared';
import {
  buildTripCoverSteps,
  confirmPath,
  findStepIndex,
  findTripCoverForStep,
  getPreviousStepPath,
  parseTripCoverStepFromParams,
  regionsPath,
} from 'lib/account/tripCover/steps';
import { emptyTripCoverAgeLimits } from 'lib/firms/firmDefaults';
import type { FormErrorsState } from 'types/register';
import type {
  CoverArea,
  TripCoverAgeLimits as TripCoverAgeLimitsData,
  TripType,
} from 'types/travel-insurance-firm';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

type PageProps = {
  firmId: string;
  coverArea: CoverArea;
  tripType: TripType;
  initialAgeLimits: TripCoverAgeLimitsData;
  initialErrors: FormErrorsState | null;
  backLink: string;
  heading: string;
  isChangeAnswer: boolean;
  stepIndex: number;
};

const analyticsConfig = getSelfServeConfig('tripCover');

const Page = ({
  firmId,
  coverArea,
  tripType,
  initialAgeLimits,
  initialErrors,
  backLink,
  heading,
  isChangeAnswer,
  stepIndex,
}: PageProps) => {
  const step = `${stepIndex + 2}` as unknown as TripCoverStep;

  const analyticsData = getAnalyticsStepData(
    'selfServe',
    'tripCover',
    step,
    heading,
  );

  return (
    <ErrorSummaryProvider
      key={`${firmId}-${coverArea}-${tripType}`}
      initialErrors={initialErrors ?? {}}
      initialValues={{}}
      isRadio={true}
      fieldLabels={getAgeLimitFieldLabels()}
      errorMessageOverrides={getAgeLimitRequiredMessages()}
    >
      {({ errorSummarySection }) => (
        <TravelInsuranceDirectory
          browserTitle={`Self Serve - ${heading}`}
          backLink={backLink}
          heading={heading}
          showLanguageSwitcher={false}
          errorSummarySection={errorSummarySection}
          analyticsData={analyticsData}
          analyticsConfig={analyticsConfig}
        >
          <TripCoverAgeLimitsForm
            key={`${firmId}-${coverArea}-${tripType}`}
            firmId={firmId}
            coverArea={coverArea}
            tripType={tripType}
            initialAgeLimits={initialAgeLimits}
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
  const load = await loadRequiredAccountFirmParams(context, {} as PageProps);
  const step = parseTripCoverStepFromParams(context.params);

  if (load.status === 'redirect') {
    return { redirect: load.redirect, props: load.emptyProps };
  }

  if (load.status === 'notFound' || !step) {
    return { notFound: true };
  }

  const { firmId, resolved } = load;
  const viewFirm = mergeFirmWithSelfServeEditDraft(resolved.firm);
  const tripCovers = viewFirm.trip_covers ?? [];
  const steps = buildTripCoverSteps(tripCovers);
  const stepIndex = findStepIndex(steps, step.coverArea, step.tripType);

  if (stepIndex < 0) {
    return { notFound: true };
  }

  const isChangeAnswer = context.query.change === 'true';
  const currentStep = steps[stepIndex];
  const selfServeBackLink =
    getPreviousStepPath(firmId, tripCovers, currentStep) ?? regionsPath(firmId);
  const backLink = isChangeAnswer ? confirmPath(firmId) : selfServeBackLink;

  const matchingCover = findTripCoverForStep(tripCovers, currentStep);
  const errorCookie = getCookieAndCleanUp(context, 'form_error', true);

  return {
    props: {
      firmId,
      coverArea: step.coverArea,
      tripType: step.tripType,
      initialAgeLimits: matchingCover?.age_limits ?? emptyTripCoverAgeLimits(),
      initialErrors: errorCookie?.fields ?? null,
      backLink,
      heading: getAgePageHeading(step.coverArea, step.tripType),
      isChangeAnswer,
      stepIndex,
    },
  };
};
