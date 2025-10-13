import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Heading } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';

import { Loader } from '../../../components/Loader';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { getLoadTimes } from '../../../lib/fetch';
import {
  getUserSessionFromCookies,
  handlePageError,
  storeCurrentUrl,
} from '../../../lib/utils';

type PageProps = {
  expectedTime: number;
  remainingTime: number;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  expectedTime,
  remainingTime,
}) => {
  const { t, locale } = useTranslation();
  const title = t('pages.searching-for-your-pension.title');

  const items = [
    {
      text: t('pages.searching-for-your-pension.carousel.text-1'),
      subText: t('pages.searching-for-your-pension.carousel.subtext-1'),
    },
    {
      text: t('pages.searching-for-your-pension.carousel.text-2'),
      subText: t('pages.searching-for-your-pension.carousel.subtext-2'),
    },
    {
      text: t('pages.searching-for-your-pension.carousel.text-3'),
    },
  ];

  return (
    <PensionsDashboardLayout seoTitle={title} isOffset={false}>
      <Heading
        level="h1"
        className="leading-10 text-center text-blue-700 md:mt-24"
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
        carouselHeading={t('pages.searching-for-your-pension.carousel.heading')}
        carouselItems={items}
      />
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const userSession = getUserSessionFromCookies(cookies);
  const language = context.query.language as string;
  storeCurrentUrl(context);

  try {
    const { expectedTime, remainingTime } = await getLoadTimes(userSession);

    return {
      props: {
        expectedTime,
        remainingTime,
      },
    };
  } catch (error) {
    return handlePageError(
      error,
      language,
      'Error fetching pension data load times:',
    );
  }
};
