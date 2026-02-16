import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Heading } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';

import { Loader } from '../../../components/Loader';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { getPensionsStatus } from '../../../lib/api/pension-data-service';
import { useMHPDAnalytics } from '../../../lib/hooks';
import {
  getUserSessionFromCookies,
  handlePageError,
  storeCurrentUrl,
  withAuth,
} from '../../../lib/utils/system';

type PageProps = {
  expectedTime: number;
  remainingTime: number;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  expectedTime,
  remainingTime,
}) => {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'pages.searching-for-your-pension.title';
  const title = t(titleKey);

  // Track analytics for this page
  useMHPDAnalytics({
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
  });

  return (
    <PensionsDashboardLayout seoTitle={title} isOffset={false}>
      <Heading
        level="h1"
        className="leading-10 text-center text-blue-700 md:mt-24"
        id="top"
        tabIndex={-1}
      >
        {title}
      </Heading>
      <Loader
        duration={expectedTime}
        durationLeft={remainingTime}
        description={t('pages.searching-for-your-pension.description', {
          duration: `${expectedTime}`,
        })}
        refreshText={t('pages.searching-for-your-pension.refresh')}
        progressComplete={t('common.progress-complete')}
        redirectUrl={`/${locale}/your-pension-search-results`}
      />
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const cookies = new Cookies(context.req, context.res);
    const userSession = getUserSessionFromCookies(cookies);
    const language = context.query.language as string;
    storeCurrentUrl(context);

    try {
      const {
        predictedTotalDataRetrievalTime,
        predictedRemainingDataRetrievalTime,
      } = await getPensionsStatus({ userSession });

      return {
        props: {
          expectedTime: predictedTotalDataRetrievalTime,
          remainingTime: predictedRemainingDataRetrievalTime,
        },
      };
    } catch (error) {
      return handlePageError(
        error,
        language,
        'Error fetching pension data load times:',
      );
    }
  },
);
