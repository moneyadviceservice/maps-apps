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
    <PensionsDashboardLayout
      title={title}
      isLoggedInPage={false}
      isOffset={false}
      toTopLink={false}
    >
      <div className="md:pt-8 md:max-w-4xl">
        <Paragraph className="mb-6">
          {t('site.logout.we-will-redirect')}
        </Paragraph>
        <Paragraph>{t('site.logout.are-you-sure')}</Paragraph>
        <div className="mt-10 md:mt-16 md:flex">
          <Link
            asButtonVariant="primary"
            href={`/${locale}/you-have-exited-the-pensions-dashboard`}
            className="block w-full mb-4 text-center md:mr-4 md:inline-flex md:text-left md:mb-0 md:w-auto"
          >
            {t('site.logout.yes-exit')}
          </Link>
          <Link
            asButtonVariant="secondary"
            href={`/${locale}${backLink ?? '/your-pension-search-results'}`}
            className="block w-full text-center md:w-auto md:inline-flex md:text-left"
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
