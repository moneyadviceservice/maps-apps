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
import { MODAL_TIMEOUT_SECONDS } from '../../../lib/constants';
import { getMhpdSessionConfig } from '../../../lib/utils/sessionConfig';

type PageProps = {
  backLink: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  backLink,
}) => {
  const { t, locale } = useTranslation();
  const title = t('timeout.been-inactive');

  const timeoutMinutes = Math.floor(MODAL_TIMEOUT_SECONDS / 60);

  return (
    <PensionsDashboardLayout
      title={title}
      enableTimeOut={false}
      isOffset={false}
    >
      <div className="md:py-8 md:max-w-4xl">
        <Markdown
          className="mb-6"
          content={
            t('timeout.session-will-timeout', {
              totalTimeout: timeoutMinutes.toString(),
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
          content={`${MODAL_TIMEOUT_SECONDS};url=/${locale}/your-session-has-expired`}
        />
      </noscript>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const { supportCurrentUrl, currentUrl } = getMhpdSessionConfig(cookies);
  const backLink = supportCurrentUrl || currentUrl || null;

  return {
    props: {
      backLink,
    },
  };
};
