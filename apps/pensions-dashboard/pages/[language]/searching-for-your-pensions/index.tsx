import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Heading } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';

import { Loader } from '../../../components/Loader';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { DEFAULT_LOAD_TIME } from '../../../lib/constants';
import { getLoadTimes } from '../../../lib/fetch';
import { getUserSessionFromCookies, storeCurrentUrl } from '../../../lib/utils';

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
      image: {
        src: '/carousel/piggy-bank-logo.png',
        height: 102,
        width: 82,
        alt: t('pages.searching-for-your-pension.carousel.not-matched-alt'),
      },
      text: t('pages.searching-for-your-pension.carousel.not-matched'),
    },
    {
      image: {
        src: '/carousel/dashboard-screen-logo.png',
        height: 85,
        width: 101,
        alt: t('pages.searching-for-your-pension.carousel.dashboard-alt'),
      },
      text: t('pages.searching-for-your-pension.carousel.dashboard'),
    },
    {
      image: {
        src: '/carousel/three-arrows-logo.png',
        height: 117,
        width: 95,
        alt: t('pages.searching-for-your-pension.carousel.schemes-alt'),
      },
      text: t('pages.searching-for-your-pension.carousel.schemes'),
    },
  ];

  return (
    <PensionsDashboardLayout seoTitle={title}>
      <Heading level="h1" className="mb-8 text-center">
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
    console.error('Error fetching pension data load times:', error);

    return {
      props: {
        expectedTime: DEFAULT_LOAD_TIME,
        remainingTime: DEFAULT_LOAD_TIME,
      },
    };
  }
};
