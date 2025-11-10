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
import { getPensionsByCategory } from '../../../lib/api/pension-data-service';
import { PensionsCardType, PensionsCategory } from '../../../lib/constants';
import { PensionArrangement } from '../../../lib/types';
import { sortPensions } from '../../../lib/utils/data';
import {
  getUserSessionFromCookies,
  handlePageError,
  storeCurrentUrl,
} from '../../../lib/utils/system';

type PageProps = {
  data: PensionArrangement[];
  redPensions: number;
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
      isOffset={false}
    >
      <div className="mb-6 xl:grid xl:grid-cols-12 xl:gap-4">
        <div className="xl:col-span-8 2xl:col-span-7">
          <Markdown content={t('pages.pending-pensions.description')} />
        </div>
      </div>

      <ul
        data-testid="pending-pensions"
        className="grid grid-cols-1 gap-6 mt-6 md:mt-10 lg:gap-8 lg:grid-cols-2 xl:grid-cols-3"
      >
        {data.map((arrangement) => (
          <li key={arrangement.externalAssetId} className="col-span-1">
            <PensionsCard data={arrangement} type={PensionsCardType.PENDING} />
          </li>
        ))}
      </ul>
      {redPensions > 0 && (
        <div className="mt-6 xl:grid xl:grid-cols-12 xl:gap-8">
          <div className="xl:col-span-8">
            <UnconfirmedPensionsCallout count={redPensions} />
          </div>
        </div>
      )}
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const userSession = getUserSessionFromCookies(cookies);
  const language = context.query.language as string;

  storeCurrentUrl(context, 'INCOMPLETE');

  try {
    const data = await getPensionsByCategory(PensionsCategory.PENDING, {
      userSession,
    });

    if (!data?.arrangements) {
      return { notFound: true };
    }

    const pensions = sortPensions(data.arrangements);

    return {
      props: {
        data: pensions,
        redPensions: data.totalContactPensions || 0,
      },
    };
  } catch (error) {
    return handlePageError(error, language, 'Error fetching pending pensions:');
  }
};
