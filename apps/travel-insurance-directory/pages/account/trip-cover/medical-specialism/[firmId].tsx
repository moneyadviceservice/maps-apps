import { GetServerSideProps } from 'next';

import { MedicalSpecialism } from 'components/Account/TripCover/MedicalSpecialism';
import { ErrorSummaryProvider } from 'context/ErrorSummaryProvider';
import { getSelfServeConfig } from 'data/analytics/selfServe/config';
import { getAnalyticsStepData } from 'data/analytics/selfServe/data';
import {
  MEDICAL_SPECIALISM_FIELD_LABELS,
  MEDICAL_SPECIALISM_REQUIRED_MESSAGES,
} from 'data/pages/account/tripCover/medical-specialism';
import { TravelInsuranceDirectory } from 'layouts/TravelInsuranceDirectory';
import { mergeFirmWithSelfServeEditDraft } from 'lib/account/selfServeEditDraft';
import {
  formatMedicalSpecialismToFormValues,
  type MedicalSpecialismFormFieldKey,
} from 'lib/account/tripCover/medicalSpecialism';
import {
  loadRequiredAccountFirmParams,
  redirectToSelfServeStep,
} from 'lib/account/tripCover/shared';
import {
  confirmPath,
  getLastStepPath,
  getSelfServeRedirectIfIncomplete,
  SELF_SERVE_GUARD_PAGE,
} from 'lib/account/tripCover/steps';
import type { FormErrorsState } from 'types/register';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

type PageProps = {
  firmId: string;
  backLink: string;
  initialErrors: FormErrorsState | null;
  initialFormValues: Record<MedicalSpecialismFormFieldKey, string>;
  isChangeAnswer: boolean;
};

const heading = 'Medical Specialism';

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
      fieldLabels={MEDICAL_SPECIALISM_FIELD_LABELS}
      errorMessageOverrides={MEDICAL_SPECIALISM_REQUIRED_MESSAGES}
    >
      {({ errorSummarySection }) => (
        <TravelInsuranceDirectory
          browserTitle="Self Serve - Medical Specialism"
          backLink={backLink}
          heading="Medical Specialism"
          showLanguageSwitcher={false}
          errorSummarySection={errorSummarySection}
          analyticsData={analyticsData}
          analyticsConfig={analyticsConfig}
        >
          <MedicalSpecialism
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
    { page: SELF_SERVE_GUARD_PAGE.medicalSpecialism, isChangeAnswer },
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
      initialFormValues: formatMedicalSpecialismToFormValues(
        viewFirm.medical_specialisms,
      ),
      isChangeAnswer,
    },
  };
};
