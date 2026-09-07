import { GetServerSideProps } from 'next';

import { PrinciplePlaceOfBusiness } from 'components/Account/FirmDetails';
import { getSelfServeConfig } from 'data/analytics/selfServe/config';
import { getAnalyticsStepData } from 'data/analytics/selfServe/data';
import { principlePlaceOfBusinessPage } from 'data/pages/account/firm-details/principle-place-of-business';
import { SelfServeFormLayout } from 'layouts/SelfServeFormLayout/SelfServeFormLayout';
import {
  customerContactDetailsPath,
  firmDetailsBackLink,
} from 'lib/account/firmDetails';
import {
  type FirmDetailsPageProps,
  loadFirmDetailsPageProps,
} from 'lib/account/firmDetails/loadFirmDetailsPageProps';

type PageProps = FirmDetailsPageProps & {
  backLink: string;
};

const heading = 'Principle place of business';

const analyticsData = getAnalyticsStepData(
  'selfServe',
  'firmDetails',
  2,
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
      title={principlePlaceOfBusinessPage.title}
      backLink={backLink}
      initialErrors={initialErrors}
      analyticsData={analyticsData}
      analyticsConfig={analyticsConfig}
    >
      <PrinciplePlaceOfBusiness
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
        customerContactDetailsPath(load.props.firmId),
      ),
    },
  };
};
