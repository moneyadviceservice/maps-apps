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
    >
      <div className="md:max-w-4xl">
        <Paragraph className="mb-6">
          {t('timeout.automatic-expiry', {
            totalTimeout: totalTimeout.toString(),
          })}
        </Paragraph>
        <Paragraph>{t('timeout.sign-in-again')}</Paragraph>
        <Link className="mt-6" asButtonVariant="primary" href={`/${locale}`}>
          {t('timeout.return-to-start')}
        </Link>
      </div>
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
