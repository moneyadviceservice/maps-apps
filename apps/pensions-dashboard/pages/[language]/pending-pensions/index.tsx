import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionsCard } from '../../../components/PensionsCard';
import { UnconfirmedPensionsCallout } from '../../../components/UnconfirmedPensionsCallout';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { PensionsCardType } from '../../../lib/constants';
import { getAllPensions } from '../../../lib/fetch';
import { PensionArrangement } from '../../../lib/types';
import {
  getUserSessionFromCookies,
  setDashboardChannel,
  storeCurrentUrl,
} from '../../../lib/utils';

type PageProps = {
  data: PensionArrangement[];
  redPensions: PensionArrangement[];
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  data,
  redPensions,
}) => {
  const { t, locale } = useTranslation();
  const title = t('pages.pending-pensions.title');

  return (
    <PensionsDashboardLayout
      title={title}
      back={`/${locale}/your-pension-search-results`}
      helpAndSupport
    >
      <div className="mb-6 xl:grid xl:grid-cols-10 xl:gap-4">
        <div className="xl:col-span-8 2xl:col-span-7">
          <Markdown content={t('pages.pending-pensions.description')} />
        </div>
      </div>

      <ul
        data-testid="pending-pensions"
        className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3"
      >
        {data.map((arrangement) => (
          <li key={arrangement.externalAssetId} className="col-span-1">
            <PensionsCard data={arrangement} type={PensionsCardType.PENDING} />
          </li>
        ))}
      </ul>
      <div className="xl:grid xl:grid-cols-10 xl:gap-4">
        <div className="md:mt-10 xl:col-span-8 2xl:col-span-7">
          {redPensions && <UnconfirmedPensionsCallout data={redPensions} />}
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const userSession = getUserSessionFromCookies(cookies);

  storeCurrentUrl(context);
  setDashboardChannel(context, 'INCOMPLETE');

  try {
    const data = await getAllPensions(userSession);

    // If there are no incomplete pensions, return 404 page
    if (!data?.yellowPensions) {
      return { notFound: true };
    }

    const { yellowPensions, redPensions } = data;

    return {
      props: {
        data: yellowPensions,
        redPensions,
      },
    };
  } catch (error) {
    console.error('Error fetching pending pensions:', error);
    return { notFound: true };
  }
};
