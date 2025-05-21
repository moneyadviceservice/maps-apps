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
    <PensionsDashboardLayout
      title={title}
      enableTimeOut={false}
      isOffset={false}
      toTopLink={false}
    >
      <div className="md:py-8 md:max-w-4xl">
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
        <Paragraph className="mb-6">{t('timeout.sign-in-again')}</Paragraph>
      </div>
      <div className="py-3 md:py-2 md:flex">
        <Link
          asButtonVariant="primary"
          className="block w-full mb-4 text-center md:mr-4 md:inline-flex md:text-left md:mb-0 md:w-auto"
          href={`/${locale}${backLink ?? '/your-pension-search-results'}`}
        >
          {t('timeout.keep-me-signed-in')}
        </Link>
        <Link
          asButtonVariant="secondary"
          href={`/${locale}/you-have-exited-the-pensions-dashboard`}
          className="block w-full text-center md:w-auto md:inline-flex md:text-left"
        >
          {t('timeout.log-me-out')}
        </Link>
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
