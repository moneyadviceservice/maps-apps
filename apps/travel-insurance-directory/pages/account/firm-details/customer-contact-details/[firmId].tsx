import { GetServerSideProps } from 'next';

import { CustomerContactDetails } from 'components/Account/FirmDetails';
import { getSelfServeConfig } from 'data/analytics/selfServe/config';
import { getAnalyticsStepData } from 'data/analytics/selfServe/data';
import { customerContactDetailsPage } from 'data/pages/account/firm-details/customer-contact-details';
import { SelfServeFormLayout } from 'layouts/SelfServeFormLayout/SelfServeFormLayout';
import {
  customerContactDetailsPath,
  firmDetailsBackLink,
} from 'lib/account/firmDetails';
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

type PageProps = FirmDetailsPageProps & {
  backLink: string;
};

const heading = 'Customer contact details';

const analyticsData = getAnalyticsStepData(
  'selfServe',
  'firmDetails',
  1,
  heading,
);
const analyticsConfig = getSelfServeConfig('firmDetails');

const Page = ({
  initialErrors,
  initialValues,
  firmId,
  isChangeAnswer,
  backLink,
}: PageProps) => {
  return (
    <SelfServeFormLayout
      title={customerContactDetailsPage.title}
      backLink={backLink}
      initialErrors={initialErrors}
      analyticsData={analyticsData}
      analyticsConfig={analyticsConfig}
    >
      <CustomerContactDetails
        initialValues={initialValues}
        firmId={firmId}
        isChangeAnswer={isChangeAnswer ?? undefined}
      />
    </SelfServeFormLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context,
) => {
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
        destination: customerContactDetailsPath(preload.firmId),
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

  return {
    props: {
      ...load.props,
      backLink: firmDetailsBackLink(
        load.props.firmId,
        load.props.isChangeAnswer,
        customerContactDetailsPage.backLink,
      ),
    },
  };
};
