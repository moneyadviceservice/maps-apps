import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

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
  const title = t('timeout.been-inactive');
  const duration =
    Number(process.env.NEXT_PUBLIC_MHPD_MODAL_TIMEOUT_SECONDS) * 1000;
  const totalTimeout = Math.floor(duration / 60 / 1000);

  return (
    <PensionsDashboardLayout title={title} enableTimeOut={false}>
      <div className="md:max-w-4xl">
        <Markdown
          className="mb-6"
          content={
            t('timeout.session-will-timeout', {
              totalTimeout: totalTimeout.toString(),
            }) +
            ' ' +
            t('timeout.protect-your-information')
          }
        />
        <Paragraph>{t('timeout.sign-in-again')}</Paragraph>
        <div className="flex mt-10">
          <Link
            asButtonVariant="primary"
            className="mr-4"
            href={`/${locale}${backLink ?? '/your-pension-search-results'}`}
          >
            {t('timeout.keep-me-signed-in')}
          </Link>
          <Link
            asButtonVariant="secondary"
            href={`/${locale}/you-have-exited-the-dashboard`}
          >
            {t('timeout.log-me-out')}
          </Link>
        </div>
      </div>

      <noscript data-testid="noscript-refresh">
        <meta
          httpEquiv="refresh"
          content={`${duration / 1000};url=/${locale}/your-session-has-expired`}
        />
      </noscript>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const supportCurrentUrl = cookies.get('supportCurrentUrl');
  const backLink = supportCurrentUrl ?? cookies.get('currentUrl') ?? null;

  return {
    props: {
      backLink,
    },
  };
};
