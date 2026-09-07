import { GetServerSideProps } from 'next';

import { ServiceDetails } from 'components/Account/TripCover/ServiceDetails';
import { ErrorSummaryProvider } from 'context/ErrorSummaryProvider';
import { getSelfServeConfig } from 'data/analytics/selfServe/config';
import { getAnalyticsStepData } from 'data/analytics/selfServe/data';
import {
  SERVICE_DETAILS_FIELD_LABELS,
  SERVICE_DETAILS_REQUIRED_MESSAGES,
} from 'data/pages/account/tripCover/service-details';
import { TravelInsuranceDirectory } from 'layouts/TravelInsuranceDirectory';
import { mergeFirmWithSelfServeEditDraft } from 'lib/account/selfServeEditDraft';
import {
  formatServiceDetailsToFormValues,
  type ServiceDetailsFormFieldKey,
} from 'lib/account/tripCover/ServiceDetails';
import {
  loadRequiredAccountFirmParams,
  redirectToSelfServeStep,
} from 'lib/account/tripCover/shared';
import {
  confirmPath,
  getLastStepPath,
  getSelfServeRedirectIfIncomplete,
} from 'lib/account/tripCover/steps';
import type { FormErrorsState } from 'types/register';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

type PageProps = {
  firmId: string;
  backLink: string;
  initialErrors: FormErrorsState | null;
  initialFormValues: Record<ServiceDetailsFormFieldKey, string>;
  isChangeAnswer: boolean;
};

const heading = 'Service details';

const analyticsData = getAnalyticsStepData(
  'selfServe',
  'tripCover',
  8,
  heading,
);
const analyticsConfig = getSelfServeConfig('tripCover');

const Page = ({
  firmId,
  backLink,
  initialErrors,
  initialFormValues,
  isChangeAnswer,
}: PageProps) => {
  return (
    <ErrorSummaryProvider
      initialErrors={initialErrors ?? {}}
      initialValues={initialFormValues}
      isRadio={true}
      fieldLabels={SERVICE_DETAILS_FIELD_LABELS}
      errorMessageOverrides={SERVICE_DETAILS_REQUIRED_MESSAGES}
    >
      {({ errorSummarySection }) => (
        <TravelInsuranceDirectory
          browserTitle="Self Serve - Service details"
          backLink={backLink}
          heading="Service details"
          showLanguageSwitcher={false}
          errorSummarySection={errorSummarySection}
          analyticsData={analyticsData}
          analyticsConfig={analyticsConfig}
        >
          <ServiceDetails
            firmId={firmId}
            initialFormValues={initialFormValues}
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

  if (load.status === 'redirect') {
    return { redirect: load.redirect, props: load.emptyProps };
  }

  if (load.status === 'notFound') {
    return { notFound: true };
  }

  const { firmId, resolved } = load;
  const isChangeAnswer = context.query.change === 'true';
  const viewFirm = mergeFirmWithSelfServeEditDraft(resolved.firm);

  const incompleteRedirect = getSelfServeRedirectIfIncomplete(
    firmId,
    viewFirm,
    { page: 'service-details', isChangeAnswer },
  );

  if (incompleteRedirect) {
    return redirectToSelfServeStep(incompleteRedirect);
  }

  const tripCovers = viewFirm.trip_covers ?? [];
  const backLink = isChangeAnswer
    ? confirmPath(firmId)
    : getLastStepPath(firmId, tripCovers) ?? '/account';

  const errorCookie = getCookieAndCleanUp(context, 'form_error', true);

  return {
    props: {
      firmId,
      backLink,
      initialErrors: errorCookie?.fields ?? null,
      initialFormValues: formatServiceDetailsToFormValues(
        viewFirm.service_details,
      ),
      isChangeAnswer,
    },
  };
};
