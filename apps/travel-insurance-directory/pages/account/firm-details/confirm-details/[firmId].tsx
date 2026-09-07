import { Suspense } from 'react';

import { GetServerSideProps } from 'next';

import { ConfirmDetails } from 'components/Account/FirmDetails/ConfirmDetails';
import { getSelfServeConfig } from 'data/analytics/selfServe/config';
import { getAnalyticsStepData } from 'data/analytics/selfServe/data';
import { confirmDetailsPage } from 'data/pages/account/firm-details/confirm-details';
import { SelfServeFormLayout } from 'layouts/SelfServeFormLayout';
import { confirmDetailsPath, openingHoursPath } from 'lib/account/firmDetails';
import {
  type FirmDetailsPageProps,
  loadFirmDetailsPageProps,
} from 'lib/account/firmDetails/loadFirmDetailsPageProps';
import { isCustomerContactConfirmed } from 'lib/account/firmSectionStatus';
import {
  clearCustomerContactDraftOnJourneyStart,
  shouldResetDraftOnEntry,
} from 'lib/account/selfServeEditDraft/clearDraftOnEntry';
import { loadRequiredAccountFirmParams } from 'lib/account/tripCover/shared';

type ConfirmDetailsPageProps = FirmDetailsPageProps & {
  backLink: string;
};

const heading = 'Confirm details';

const analyticsData = getAnalyticsStepData(
  'selfServe',
  'firmDetails',
  4,
  heading,
);
const analyticsConfig = getSelfServeConfig('firmDetails');

const Page = ({
  initialValues,
  initialErrors,
  firmId,
  backLink,
}: ConfirmDetailsPageProps) => {
  if (!initialValues) {
    return null;
  }

  return (
    <SelfServeFormLayout
      title={confirmDetailsPage.title}
      backLink={backLink}
      initialErrors={initialErrors}
      analyticsData={analyticsData}
      analyticsConfig={analyticsConfig}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ConfirmDetails firmData={initialValues} firmId={firmId} />
      </Suspense>
    </SelfServeFormLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<
  ConfirmDetailsPageProps
> = async (context) => {
  if (shouldResetDraftOnEntry(context.query)) {
    const preload = await loadRequiredAccountFirmParams(context, {});
    if (preload.status === 'redirect') {
      return { redirect: preload.redirect };
    }
    if (preload.status === 'notFound') {
      return { notFound: true };
    }

    if (isCustomerContactConfirmed(preload.resolved.firm)) {
      await clearCustomerContactDraftOnJourneyStart(preload.resolved.firm);
    }
    return {
      redirect: {
        destination: confirmDetailsPath(preload.firmId),
        permanent: false,
      },
    };
  }

  const load = await loadFirmDetailsPageProps(context);

  if (load.status === 'redirect') {
    return { redirect: load.redirect };
  }

  if (load.status === 'notFound') {
    return { notFound: true };
  }

  const firm = load.props.initialValues;
  // First-time confirm → previous step. After confirm (draft/edit mode) → account.
  const backLink =
    firm != null && isCustomerContactConfirmed(firm)
      ? '/account'
      : openingHoursPath(load.props.firmId);

  return {
    props: {
      ...load.props,
      backLink,
    },
  };
};
