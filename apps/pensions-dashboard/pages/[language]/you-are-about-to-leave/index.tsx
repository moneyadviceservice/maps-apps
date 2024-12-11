import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';

type PageProps = {
  backLink: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  backLink,
}) => {
  const { t, locale } = useTranslation();
  const title = t('site.logout.about-to-leave');

  return (
    <PensionsDashboardLayout title={title} isLoggedInPage={false}>
      <div className="md:max-w-4xl">
        <Paragraph>{t('site.logout.we-will-redirect')}</Paragraph>
        <Paragraph>{t('site.logout.are-you-sure')}</Paragraph>
        <div className="flex mt-10">
          <Link
            asButtonVariant="primary"
            href={`/${locale}/you-have-exited-the-dashboard`}
            className="mr-4"
          >
            {t('site.logout.yes-exit')}
          </Link>
          <Link
            asButtonVariant="secondary"
            href={`/${locale}${backLink ?? '/your-pension-search-results'}`}
          >
            {t('common.cancel')}
          </Link>
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);
  const supportCurrentUrl = cookies.get('supportCurrentUrl');
  const backLink = supportCurrentUrl ?? cookies.get('currentUrl') ?? null;

  return {
    props: {
      backLink,
    },
  };
};
