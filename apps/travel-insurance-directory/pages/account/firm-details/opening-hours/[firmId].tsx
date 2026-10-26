import { GetServerSideProps } from 'next';

import { OpeningHours } from 'components/Account/FirmDetails';
import { getSelfServeConfig } from 'data/analytics/selfServe/config';
import { getAnalyticsStepData } from 'data/analytics/selfServe/data';
import {
  OPENING_HOURS_ERROR_MESSAGES,
  openingHoursPage,
} from 'data/pages/account/firm-details/opening-hours';
import { SelfServeFormLayout } from 'layouts/SelfServeFormLayout/SelfServeFormLayout';
import {
  firmDetailsBackLink,
  principlePlaceOfBusinessPath,
} from 'lib/account/firmDetails';
import {
  type FirmDetailsPageProps,
  loadFirmDetailsPageProps,
} from 'lib/account/firmDetails/loadFirmDetailsPageProps';

type PageProps = FirmDetailsPageProps & {
  backLink: string;
};

const heading = 'Opening hours';

const analyticsData = getAnalyticsStepData(
  'selfServe',
  'firmDetails',
  3,
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
      title={openingHoursPage.title}
      backLink={backLink}
      initialErrors={initialErrors}
      errorMessageOverrides={OPENING_HOURS_ERROR_MESSAGES}
      analyticsData={analyticsData}
      analyticsConfig={analyticsConfig}
    >
      <OpeningHours
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
        principlePlaceOfBusinessPath(load.props.firmId),
      ),
    },
  };
};
