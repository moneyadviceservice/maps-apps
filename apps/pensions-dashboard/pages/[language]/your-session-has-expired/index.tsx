import { GetServerSideProps, NextPage } from 'next';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { logoutUser } from '../../../lib/utils';

const Page: NextPage<PensionsDashboardLayoutProps> = () => {
  const { t, locale } = useTranslation();
  const title = t('timeout.session-expired');
  const timeoutDuration = Number(process.env.NEXT_PUBLIC_MHPD_TIMEOUT_SECONDS);
  const modalTimeoutDuration = Number(
    process.env.NEXT_PUBLIC_MHPD_MODAL_TIMEOUT_SECONDS,
  );
  const totalTimeout = (timeoutDuration + modalTimeoutDuration) / 60;

  return (
    <PensionsDashboardLayout
      title={title}
      enableTimeOut={false}
      isLoggedInPage={false}
      isOffset={false}
      toTopLink={false}
    >
      <div className="pb-6 md:py-8 md:max-w-4xl">
        <Paragraph className="mb-6">
          {t('timeout.automatic-expiry', {
            totalTimeout: totalTimeout.toString(),
          })}
        </Paragraph>
        <Paragraph>{t('timeout.sign-in-again')}</Paragraph>
      </div>
      <Link
        className="block w-full my-3 text-center md:w-auto md:inline-flex md:text-left"
        asButtonVariant="primary"
        href={`/${locale}`}
      >
        {t('timeout.return-to-start')}
      </Link>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  logoutUser(req, res);

  return {
    props: {},
  };
};
