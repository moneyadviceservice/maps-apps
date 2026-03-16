import { useEffect } from 'react';

import { GetServerSideProps, NextPage } from 'next';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { useAnalyticsProvider } from '../../../lib/contexts/AnalyticsContext';
import { useMHPDAnalytics } from '../../../lib/hooks';
import { logoutUser } from '../../../lib/utils/system';

const Page: NextPage<PensionsDashboardLayoutProps> = () => {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const { setUserSessionId } = useAnalyticsProvider();
  const titleKey = 'timeout.exited-the-dashboard';
  const title = t(titleKey);

  // Clear analytics session on logout page load
  useEffect(() => {
    setUserSessionId('');
  }, [setUserSessionId]);

  // Track analytics for this page
  useMHPDAnalytics({
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
  });

  return (
    <PensionsDashboardLayout
      title={title}
      enableTimeOut={false}
      isLoggedInPage={false}
      isOffset={false}
    >
      <div className="md:pt-8">
        <Paragraph className="mb-8">
          {t('timeout.to-return-to-dashboard')}
        </Paragraph>
        <Link
          asButtonVariant="primary"
          href={`/${locale}`}
          className="block w-full text-center md:w-auto md:inline-flex md:text-left"
        >
          {t('timeout.return-to-start')}
        </Link>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    await logoutUser(req, res);
  } catch (error) {
    // If DELETE failed (5XX error), show 404 error page
    console.error('Logout failed due to DELETE error:', error);
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};
