import { NextPage } from 'next';
import { Heading } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Loader } from '../../../components/Loader';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';

const Page: NextPage<PensionsDashboardLayoutProps> = () => {
  const { t, locale } = useTranslation();
  const title = t('pages.loading.title');

  return (
    <PensionsDashboardLayout>
      <Heading level="h1" className="mb-8 text-center">
        {title}
      </Heading>
      <Loader
        duration={Number(process.env.NEXT_PUBLIC_MHPD_LOAD_DURATION)}
        description={t('pages.loading.description', {
          duration: process.env.NEXT_PUBLIC_MHPD_LOAD_DURATION ?? '80',
        })}
        refreshText={t('pages.loading.refresh')}
        progressComplete={t('common.progress-complete')}
        redirectUrl={`/${locale}/overview`}
        carouselHeading={t('pages.loading.carousel.heading')}
        carouselItems={[
          {
            image: {
              src: '/carousel/piggy-bank-logo.png',
              height: 102,
              width: 82,
              alt: t('pages.loading.carousel.not-matched-alt'),
            },
            text: t('pages.loading.carousel.not-matched'),
          },
          {
            image: {
              src: '/carousel/dashboard-screen-logo.png',
              height: 85,
              width: 101,
              alt: t('pages.loading.carousel.dashboard-alt'),
            },
            text: t('pages.loading.carousel.dashboard'),
          },
          {
            image: {
              src: '/carousel/three-arrows-logo.png',
              height: 117,
              width: 95,
              alt: t('pages.loading.carousel.schemes-alt'),
            },
            text: t('pages.loading.carousel.schemes'),
          },
        ]}
      />
    </PensionsDashboardLayout>
  );
};

export default Page;
