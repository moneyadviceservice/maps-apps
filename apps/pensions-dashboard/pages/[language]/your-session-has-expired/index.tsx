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
import {
  BACKEND_TIMEOUT_SECONDS,
  MODAL_TIMEOUT_SECONDS,
  TIMEOUT_SECONDS,
} from '../../../lib/constants';
import { useMHPDAnalytics } from '../../../lib/hooks';
import {
  getUserSessionFromCookies,
  isSessionExpired,
  logoutUser,
} from '../../../lib/utils/system';

type PageProps = PensionsDashboardLayoutProps & {
  timeoutMinutes: string;
  expiryType: string;
};

const Page: NextPage<PageProps> = ({ timeoutMinutes, expiryType }) => {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'timeout.session-expired';
  const title = t(titleKey);

  // Track analytics for this page
  useMHPDAnalytics({
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
  });

  // Use the timeout minutes passed from server side
  const expiryMessage = t(`timeout.${expiryType}-expiry`, {
    timeoutMinutes,
  });

  return (
    <PensionsDashboardLayout
      title={title}
      enableTimeOut={false}
      isLoggedInPage={false}
      isOffset={false}
    >
      <div className="pb-6 md:py-8 md:max-w-4xl">
        <Markdown content={expiryMessage} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  try {
    await logoutUser(req, res);
  } catch (error) {
    // If DELETE failed (5XX error), show 404 error page
    console.error('Logout failed due to DELETE error:', error);
    return {
      notFound: true,
    };
  }

  // Check if this was a backend timeout by examining the session
  const cookies = new Cookies(req, res);
  const userSession = getUserSessionFromCookies(cookies);
  const isBackendTimeout =
    userSession?.sessionStart &&
    (await isSessionExpired(userSession.sessionStart));

  // Calculate timeout based on the type of expiry
  const timeoutSeconds = isBackendTimeout
    ? BACKEND_TIMEOUT_SECONDS
    : TIMEOUT_SECONDS + MODAL_TIMEOUT_SECONDS;

  const timeoutMinutes = Math.round(timeoutSeconds / 60).toString();
  const expiryType = isBackendTimeout ? 'session' : 'inactivity';

  return {
    props: {
      timeoutMinutes,
      expiryType,
    },
  };
};
